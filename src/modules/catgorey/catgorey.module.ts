import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './catgorey.service';
import { CategoryController } from './catgorey.controller';
import { CatgoreyRepository } from 'src/DB/repository/catgorey.repositorey';
import { S3Service } from 'src/common/service/s3.service';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Catgorey, CatgoreySchema } from 'src/DB/model/catgorey.model';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: Catgorey.name, schema: CatgoreySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CatgoreyRepository, S3Service],
  exports: [CategoryService, CatgoreyRepository], // مهم
})
export class CatgoreyModule { }
