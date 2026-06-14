import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UsePipes, ValidationPipe, ParseFilePipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { cloudFiledUpload } from 'src/common/utiles/multer/cloud.multer.options';
import { Auth, GetUser, IResponse, storageEnum } from 'src/common';
import { FileValidation } from 'src/common/utiles/multer/validation.multer';
import { endpoint } from '../catgorey/authoraztion';
import type { UserDocument } from 'src/DB/model/user.model';
import { ProductResponse } from './entities/product.entity';
import { successResponse } from 'src/common/response';
import { UpdateParameDto, UpdateProductDto } from '../product/dto/update-product.dto';
import { CreateProductDto } from '../product/dto/create-product.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

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
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: UserDocument,
    @UploadedFiles(ParseFilePipe) files: Express.Multer.File[]
  ): Promise<IResponse<ProductResponse>> {
    
    const { product, aiResult } = await this.productService.create(
      createProductDto,
      files,
      user
    );
    return successResponse<ProductResponse>({
      status: 201,
      data: { product, aiResult }
    });
  }

  @Auth(endpoint.create)
  @Patch(':productId')
  async update(
    @Param() params: UpdateParameDto,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse<ProductResponse>> {

    const product = await this.productService.update(params.productId, updateProductDto, user);
    console.log({ updateProductDto });
    return successResponse<ProductResponse>({ status: 201, data: { product } });
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
  @Patch(':productId/attachment')
  async updateAttachment(
    @Param() params: UpdateParameDto,
    @GetUser() user: UserDocument,
    @UploadedFiles(ParseFilePipe) files: Express.Multer.File[]
  ): Promise<IResponse<ProductResponse>> {

    const product = await this.productService.updateAttachment(params.productId, user, files);

    return successResponse<ProductResponse>({ status: 201, data: { product } });
  }


  @Auth(endpoint.create)
  @Delete(':productId/freeze')
  async freeze(
    @Param() params: UpdateParameDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse> {

    await this.productService.freeze(params.productId, user);
    return successResponse();
  }


  @Auth(endpoint.create)
  @Get(':productId/restore')
  async restore(
    @Param() params: UpdateParameDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse> {

    await this.productService.restore(params.productId, user);
    return successResponse();
  }


  @Auth(endpoint.create)
  @Delete(':productId')
  async remove(
    @Param() params: UpdateParameDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse> {

    await this.productService.remove(params.productId, user);
    return successResponse();
  }

// GET ALL PRODUCTS
  @Get()
  async findAll(): Promise<IResponse> {
    const products = await this.productService.findAll();

    return successResponse({
      data: { products }
    });
  }

  // GET ONE PRODUCT
  @Get(':productId')
  async findOne(
    @Param() params: UpdateParameDto,
  ): Promise<IResponse> {
    const product = await this.productService.findOne(params.productId);

    return successResponse({
      data: { product }
    });
  }





}
