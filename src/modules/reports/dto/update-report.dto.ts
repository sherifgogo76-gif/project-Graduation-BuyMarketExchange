import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { containFiled } from 'src/common';
import { CreateReportDto } from './create-report.dto';

@containFiled()
export class UpdateReportDto extends PartialType(CreateReportDto) { }


export class UpdateParameDto {

    @IsMongoId()
    reportId: Types.ObjectId

}