import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Get,
  UploadedFiles,
  UseInterceptors,
  ParseFilePipe
} from '@nestjs/common';
import { CategoryService } from './catgorey.service';
import { UpdateCatgoreyDto, UpdateParameDto } from './dto/update-catgorey.dto';
import { Auth, GetUser, IResponse, storageEnum } from 'src/common';
import type { UserDocument } from 'src/DB/model/user.model';
import { CatgoreyResponse } from './entities/catgorey.entity';
import { successResponse } from 'src/common/response';
import { endpoint } from './authoraztion';
import { CreateCatgoreyDto } from './dto/create-catgorey.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { cloudFiledUpload } from 'src/common/utiles/multer/cloud.multer.options';
import { FileValidation } from 'src/common/utiles/multer/validation.multer';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @UseInterceptors(FilesInterceptor(
    "images",
    5,
    cloudFiledUpload({
      storageapproch: storageEnum.memory,
      validation: FileValidation.image,
      fileSize: 2
    })
  ))
  @Auth(endpoint.create)
  @Post()
  async create(
    @Body() createCategoryDto: CreateCatgoreyDto,
    @GetUser() user: UserDocument,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<IResponse<CatgoreyResponse>> {

    const category = await this.categoryService.create(createCategoryDto, files, user);

    return successResponse<CatgoreyResponse>({
      status: 201,
      data: { category }
    });
  }

  @Auth(endpoint.create)
  @Patch(':categoryId')
  async update(
    @Param() params: UpdateParameDto,
    @Body() updateCategoryDto: UpdateCatgoreyDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse<CatgoreyResponse>> {

    const category = await this.categoryService.update(
      params.categoryId,
      updateCategoryDto,
      user
    );

    return successResponse<CatgoreyResponse>({
      status: 201,
      data: { category }
    });
  }


  @UseInterceptors(FilesInterceptor(
    "images",
    5,
    cloudFiledUpload({
      storageapproch: storageEnum.memory,
      validation: FileValidation.image,
      fileSize: 2
    })
  ))
  @Auth(endpoint.create)
  @Patch(':categoryId/attachment')
  async updateAttachment(
    @Param() params: UpdateParameDto,
    @GetUser() user: UserDocument,
    @UploadedFiles(ParseFilePipe) files: Express.Multer.File[]
  ): Promise<IResponse<CatgoreyResponse>> {

    const category = await this.categoryService.updateAttachment(params.categoryId, user, files);

    return successResponse<CatgoreyResponse>({ status: 201, data: { category } });
  }

  @Auth(endpoint.create)
  @Delete(':categoryId/freeze')
  async freeze(
    @Param() params: UpdateParameDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse> {

    await this.categoryService.freeze(params.categoryId, user);
    return successResponse();
  }

  @Auth(endpoint.create)
  @Get(':categoryId/restore')
  async restore(
    @Param() params: UpdateParameDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse> {

    await this.categoryService.restore(params.categoryId, user);
    return successResponse();
  }

  @Auth(endpoint.create)
  @Delete(':categoryId')
  async remove(
    @Param() params: UpdateParameDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse> {

    await this.categoryService.remove(params.categoryId, user);
    return successResponse();
  }
  // GET ALL
@Get()
async findAll(): Promise<IResponse> {

  const categories = await this.categoryService.findAll();

  return successResponse({
    data: { categories }
  });
}

// GET ONE
@Get(':categoryId')
async findOne(
   @Param() params: UpdateParameDto,
): Promise<IResponse> {

  const category = await this.categoryService.findOne(id as any);

  return successResponse({
    data: { category }
  });
}
