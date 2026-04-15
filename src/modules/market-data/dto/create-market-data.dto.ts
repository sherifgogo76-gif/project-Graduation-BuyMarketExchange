import { IsMongoId, IsNumber, IsOptional } from "class-validator";
import { Types } from "mongoose";
import { IMarketData } from "src/common";

export class CreateMarketDataDto implements Partial<IMarketData> {

    @IsMongoId()
    productId: Types.ObjectId;

    @IsNumber()
    averagePrice: number;

    @IsNumber()
    @IsOptional()
    minPrice?: number;

    @IsNumber()
    @IsOptional()
    maxPrice?: number;

    @IsNumber()
    @IsOptional()
    listingsCount?: number;

}