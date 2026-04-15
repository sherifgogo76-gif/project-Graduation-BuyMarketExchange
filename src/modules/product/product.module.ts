import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthModule } from '../auth/auth.module';
import { Product, productSchema } from 'src/DB/model/product.model';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { ProductRepository } from 'src/DB/repository/product.repository';
import { S3Service } from 'src/common/service/s3.service';
import { CatgoreyModule } from '../catgorey/catgorey.module';
import { AiService } from '../modules/ai/ai.service';
import { MarketDataModule } from '../market-data/market-data.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    CatgoreyModule, 
    forwardRef(()=>MarketDataModule),
    MongooseModule.forFeature([
      { name: Product.name, schema: productSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ ProductService,ProductRepository,S3Service,AiService],
  exports:[ProductService,ProductRepository]
})
export class ProductModule {}

