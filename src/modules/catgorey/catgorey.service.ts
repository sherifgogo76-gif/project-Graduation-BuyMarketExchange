import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDocument } from 'src/DB/model/user.model';
import { Types } from 'mongoose';
import { CreateCatgoreyDto } from './dto/create-catgorey.dto';
import { UpdateCatgoreyDto } from './dto/update-catgorey.dto';
import { Lean } from 'src/DB/repository/database.repository';
import { S3Service } from 'src/common/service/s3.service';
import { randomUUID } from 'crypto';
import { FolderEnum } from 'src/common';
import { CatgoreyRepository } from 'src/DB/repository/catgorey.repositorey';
import { CatgoreyDocument } from 'src/DB/model/catgorey.model';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CatgoreyRepository,
    private readonly s3Service: S3Service
  ) { }

  // CREATE
  async create(
    createCategoryDto: CreateCatgoreyDto,
    files: Express.Multer.File[],
    user: UserDocument
  ): Promise<CatgoreyDocument> {

    const { name } = createCategoryDto;
    const checkduplicated = await this.categoryRepository.findOne({
      filter: { name, pranaoId: false }
    });

    if (checkduplicated) {
      throw new ConflictException("category name duplicated")
    }

    const assetFolderId = randomUUID();

    const images = await this.s3Service.uploadFiles({
      files,
      path: `${FolderEnum.Catgory}/${assetFolderId}`
    });

    const category = await this.categoryRepository.create({
      data: [
        {
          ...createCategoryDto,
          images,
          assetFolderId,
          createdBy: user._id
        }
      ]
    });

    if (!category) {
      await this.s3Service.deleteFiles({ urls: images });
      throw new BadRequestException("fail to create category");
    }

    return category[0];
  }

  // UPDATE
  async update(
    categoryId: Types.ObjectId,
    updateCategoryDto: UpdateCatgoreyDto,
    user: UserDocument
  ): Promise<CatgoreyDocument | Lean<CatgoreyDocument>> {

    const categoryFind = await this.categoryRepository.findOne({
      filter: { _id: categoryId }
    });

    if (!categoryFind) {
      throw new NotFoundException("fail to find category");
    }

    const category = await this.categoryRepository.findOneAndUpdate({
      filter: { _id: categoryId },
      update: {
        ...updateCategoryDto,
        updatedBy: user._id
      },
      options: { new: true }
    });

    if (!category) {
      throw new BadRequestException("fail to update category");
    }
    console.log("category result => ", category);

    return category;
  }

  // UPDATE ATTACHMENT
  async updateAttachment(
    categoryId: Types.ObjectId,
    user: UserDocument,
    files: Express.Multer.File[],
  ): Promise<CatgoreyDocument | Lean<CatgoreyDocument>> {

    const categoryFind = await this.categoryRepository.findOne({
      filter: { _id: categoryId }
    });

    if (!categoryFind) {
      throw new NotFoundException("fail to find category");
    }

    const oldImages = categoryFind.images;

    const assetFolderId = randomUUID();
    const images = await this.s3Service.uploadFiles({
      files,
      path: `${FolderEnum.Catgory}/${assetFolderId}`
    });

    const category = await this.categoryRepository.findOneAndUpdate({
      filter: { _id: categoryId },
      update: {
        images,
        assetFolderId,
        updatedBy: user._id
      },
      options: { new: true }
    });

    if (!category) {
      await this.s3Service.deleteFiles({ urls: images });
      throw new BadRequestException("fail to update category attachments");
    }

    if (oldImages?.length) {
      await this.s3Service.deleteFiles({ urls: oldImages });
    }

    return category;
  }

  // FREEZE
  async freeze(
    categoryId: Types.ObjectId,
    user: UserDocument
  ): Promise<string> {

    const category = await this.categoryRepository.findOneAndUpdate({
      filter: { _id: categoryId },
      update: {
        freezedAt: new Date(),
        $unset: { restoredAt: true },
        updatedBy: user._id
      },
      options: { new: false }
    });

    if (!category) {
      throw new NotFoundException("fail to find category");
    }

    return "Done";
  }

  // RESTORE
  async restore(
    categoryId: Types.ObjectId,
    user: UserDocument
  ): Promise<CatgoreyDocument | Lean<CatgoreyDocument>> {

    const category = await this.categoryRepository.findOneAndUpdate({
      filter: { _id: categoryId, paranoid: false, freezedAt: { $exists: true } },
      update: {
        restoredAt: new Date(),
        $unset: { freezedAt: true },
        updatedBy: user._id
      },
      options: { new: false }
    });

    if (!category) {
      throw new NotFoundException("fail to find category");
    }

    return category;
  }

  // DELETE
  async remove(
    categoryId: Types.ObjectId,
    user: UserDocument
  ): Promise<string> {

    const category = await this.categoryRepository.findOneAndDelete({
      filter: { _id: categoryId, paranoid: false, freezedAt: { $exists: true } }
    });

    if (!category) {
      throw new NotFoundException("fail to find category");
    }

    if (category.images?.length) {
      await this.s3Service.deleteFiles({ urls: category.images });
    }

    return "done";
  }

  // GET ALL
  findAll() {
   return (await this.categoryRepository.find({ filter: { paranoid: false } })) as CatgoreyDocument[];
  }

  // GET ONE
  findOne(id: Types.ObjectId) {
    return this.categoryRepository.findOne({ filter: { _id: id } });
  }
}
