import { Type } from "class-transformer";
import { IsMongoId, IsNumber, IsOptional, IsPositive, IsString, Length } from "class-validator";
import { Types } from "mongoose";
import { IProduct } from "src/common";

export class CreateProductDto implements Partial<IProduct> {

    @Length(2, 2000)
    @IsString()
    @IsOptional()
    name: string;

    @Length(2, 2000)
    @IsString()
    @IsOptional()
    description: string;

    @IsPositive()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    discountprice: number;

    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    originalprice: number;

    @IsMongoId()
    category: Types.ObjectId



}
