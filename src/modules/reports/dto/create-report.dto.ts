import { IsMongoId, IsOptional, IsString, Length } from "class-validator";
import { Types } from "mongoose";
import { IReports } from "src/common";

export class CreateReportDto implements Partial<IReports> {

    @IsMongoId()
    productId: Types.ObjectId;

    @Length(3, 200)
    @IsString()
    reason: string;

}