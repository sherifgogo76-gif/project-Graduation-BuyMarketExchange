import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { ProductRepository } from 'src/DB/repository/product.repository';
import { S3Service } from 'src/common/service/s3.service';
import { UserDocument } from 'src/DB/model/user.model';
import { randomUUID } from 'crypto';
import { FolderEnum } from 'src/common';
import { Types } from 'mongoose';
import { UpdateProductDto } from '../product/dto/update-product.dto';
import { ProductDocument } from 'src/DB/model/product.model';
import { Lean } from 'src/DB/repository/database.repository';
import { CatgoreyRepository } from 'src/DB/repository/catgorey.repositorey';
import { AiService } from '../modules/ai/ai.service';
import { MarketDataRepository } from 'src/DB/repository/marketDaTa.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CatgoreyRepository,
    private readonly marketDataRepository:MarketDataRepository,
    private readonly s3Service: S3Service,
    private readonly aiService:AiService
  ) { }

  // async create(
  //   createProductDto: CreateProductDto,
  //   files: Express.Multer.File[],
  //   user: UserDocument
  // ): Promise<ProductDocument> {

  //   const { name, description, originalprice, discountprice, category } = createProductDto;

  //   // ✅ تأكد إن الكاتيجوري موجود
  //   const categoryExist = await this.categoryRepository.findOne({
  //     filter: { _id: category }
  //   });

  //   if (!categoryExist) {
  //     throw new BadRequestException("category not found");
  //   }

  //   const assetFolderId = randomUUID();

  //   const images = await this.s3Service.uploadFiles({
  //     files,
  //     path: `${FolderEnum.Product}/${assetFolderId}`
  //   });

  //   const product = await this.productRepository.create({
  //     data: [
  //       {
  //         name,
  //         description,
  //         originalprice,
  //         discountprice,
  //         saleprice: originalprice - originalprice * ((discountprice ?? 0) / 100),
  //         images,
  //         assetFolderId,
  //         category, // ✅ الربط الصح
  //         createdBy: user._id
  //       }
  //     ]
  //   });

  //   if (!product) {
  //     await this.s3Service.deleteFiles({ urls: images });
  //     throw new BadRequestException("fail to create product");
  //   }

  //   return product[0];
  // }

   async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
    user: UserDocument
  ): Promise<{ product: ProductDocument; aiResult?: any }> {

    const { name, description, originalprice, discountprice, category } = createProductDto;
  
    // ✅ تأكد إن الكاتيجوري موجود
    const categoryExist = await this.categoryRepository.findOne({
      filter: { _id: category }
    });
    if (!categoryExist) {
      throw new BadRequestException("category not found");
    }
  
    const assetFolderId = randomUUID();
  
    // ✅ رفع الصور
    const images = await this.s3Service.uploadFiles({
      files,
      path: `${FolderEnum.Product}/${assetFolderId}`
    });
  
    // ✅ إنشاء المنتج
    const product = await this.productRepository.create({
      data: [
        {
          name,
          description,
          originalprice,
          discountprice,
          saleprice: originalprice - originalprice * ((discountprice ?? 0) / 100),
          images,
          assetFolderId,
          category,
          createdBy: user._id
        }
      ]
    });
  
    if (!product) {
      await this.s3Service.deleteFiles({ urls: images });
      throw new BadRequestException("fail to create product");
    }
  
    const createdProduct = product[0];
    let aiResult: any = null;
    try {
      aiResult = await this.aiService.analyzeProduct({
        description: createdProduct.description,
        images: files
      });
    } catch (err) {
      console.error("AI service failed:", err);
    }
  
    // ✅ حفظ بيانات السوق إذا رجع AI نتيجة
    if (aiResult) {
      await this.marketDataRepository.create({
        data: [
          {
            productId: createdProduct._id,
            // averagePrice: aiResult.predictedPrice,
            // minPrice: aiResult.minPrice,
            // maxPrice: aiResult.maxPrice,
            // createdBy: user._id
            averagePrice: aiResult.predictedPrice || aiResult.averagePrice || originalprice, 
            minPrice: aiResult.minPrice || originalprice * 0.8,
            maxPrice: aiResult.maxPrice || originalprice * 1.2,
            createdBy: user._id
          }
        ]
      });
  
      // ✅ تحديث حالة المنتج
      await this.productRepository.updateOne({
        filter: { _id: createdProduct._id },
        update: { condition: aiResult.condition }
      });
    }
  
    // ✅ إعادة المنتج والنتيجة من AI
    return { product: createdProduct, aiResult };
  }


  async update(
    productId: Types.ObjectId,
    updateProductDto: UpdateProductDto,
    user: UserDocument
  ): Promise<ProductDocument | Lean<ProductDocument>> {

    console.log("before update", productId);
    console.log("update data", updateProductDto);

    // ✅ check category فقط لو اتبعت
    if (updateProductDto.category) {
      const categoryExist = await this.categoryRepository.findOne({
        filter: { _id: updateProductDto.category }
      });

      if (!categoryExist) {
        throw new BadRequestException("category not found");
      }
    }

    // تأكد أن المنتج موجود
    const productfind = await this.productRepository.findOne({
      filter: { _id: productId }
    });
    if (!productfind) {
      throw new NotFoundException("fail to the find product");
    }
    console.log("found product", productfind);

    // تحديث المنتج
    const product = await this.productRepository.findOneAndUpdate({
      filter: { _id: productId },
      update: {
        ...updateProductDto,
        updatedBy: user._id
      },
      options: { new: true }
    });
    if (!product) {
      throw new BadRequestException("fail to create product and update");
    }
    console.log("updated result => ", product);

    return product;
  }


  async updateAttachment(
    productId: Types.ObjectId,
    user: UserDocument,
    files: Express.Multer.File[],
  ): Promise<ProductDocument | Lean<ProductDocument>> {

    const productfind = await this.productRepository.findOne({
      filter: { _id: productId }
    });

    if (!productfind) {
      throw new NotFoundException("fail to the find product");
    }

    const oldImages = productfind.images; // خزن القديم

    let assetFolderId = randomUUID();
    const images = await this.s3Service.uploadFiles({
      files,
      path: `${FolderEnum.Product}/${assetFolderId}`
    });

    const product = await this.productRepository.findOneAndUpdate({
      filter: { _id: productId },
      update: {
        images,
        updatedBy: user._id
      },
      options: { new: true }  // مهم جدًا
    });

    if (!product) {
      await this.s3Service.deleteFiles({ urls: images });
      throw new BadRequestException("fail to update product attachments");
    }

    // الآن امسح الصور القديمة فقط بعد نجاح التعديل
    if (oldImages?.length) {
      await this.s3Service.deleteFiles({ urls: oldImages });
    }

    return product;
  }

  async freeze(
    productId: Types.ObjectId,
    user: UserDocument
  ): Promise<string> {

    const product = await this.productRepository.findOneAndUpdate({
      filter: { _id: productId },
      update: {
        freezedAt: new Date(),
        $unset: { restored: true },
        updatedBy: user._id
      },
      options: { new: false }
    })
    if (!product) {
      throw new NotFoundException("fail to the find product")
    }

    return "Done"
  }

  async restore(
    productId: Types.ObjectId,
    user: UserDocument
  ): Promise<ProductDocument | Lean<ProductDocument>> {


    const product = await this.productRepository.findOneAndUpdate({
      filter: { _id: productId, paranoid: false, freezedAt: { $exists: true } },

      update: {
        restoredAt: new Date(),
        $unset: { freezedAt: true },
        updatedBy: user._id
      },
      options: {
        new: false,
      },
    });

    if (!product) {
      throw new NotFoundException("fail to the find product");
    }

    return product;
  }

  async remove(
    productId: Types.ObjectId,
    user: UserDocument
  ): Promise<string> {

    const product = await this.productRepository.findOneAndDelete({

      filter: { _id: productId, paranoid: false, freezedAt: { $exists: true } },
    });

    if (!product) {
      throw new NotFoundException("fail to the find product");
    }
    await this.s3Service.deleteFiles({ urls: product.images })
    return "done";
  }



// GET ALL PRODUCTS
async findAll() {
    return (await this.productRepository.find({ filter: { paranoid: false } })) as ProductDocument[];
  }

  // GET ONE PRODUCT
  findOne(id: Types.ObjectId) {
    return this.productRepository.findOne({ filter: { _id: id } });
  }


}
