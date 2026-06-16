
import { IsMongoId, IsOptional, IsString, Length, IsEnum } from "class-validator";
import { Types } from "mongoose";
import { IReports, StatusEnum } from "src/common"; 

export class CreateReportDto implements Partial<IReports> {

    @IsMongoId()
    productId: Types.ObjectId;

    @Length(3, 200)
    @IsString()
    reason: string;

    @IsOptional()
    @IsEnum(StatusEnum, {  message: 'status must be a valid enum value (PENDING, APPROVED, REJECTED)',   })
    status?: StatusEnum;

}
