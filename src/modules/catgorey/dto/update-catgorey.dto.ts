import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { containFiled } from 'src/common';
import { CreateCatgoreyDto } from './create-catgorey.dto';


@containFiled()
export class UpdateCatgoreyDto extends PartialType(CreateCatgoreyDto) { }


export class UpdateParameDto {

    @IsMongoId()
    categoryId: Types.ObjectId
}
