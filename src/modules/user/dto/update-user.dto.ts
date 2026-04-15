import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { containFiled } from 'src/common';
import { CreateUserDto } from './create-user.dto';


@containFiled()
export class UpdateUserDto extends PartialType(CreateUserDto) { }


export class UpdateParameDto {

    @IsMongoId()
    userId: Types.ObjectId
    
    
}
