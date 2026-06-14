import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';
import { CreateProductDto } from './create-product.dto';
import { Types } from 'mongoose';
import { containFiled } from 'src/common';


@containFiled()
export class UpdateProductDto extends PartialType(CreateProductDto) { }


export class UpdateParameDto {

    @IsMongoId()
    productId: Types.ObjectId
    
    // @IsMongoId()
    // category: Types.ObjectId
}
