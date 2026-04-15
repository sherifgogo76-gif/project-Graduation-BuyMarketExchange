import { PartialType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';
import { IsMongoId } from 'class-validator';
import { CreateMarketDataDto } from './create-market-data.dto';

export class UpdateMarketDataDto extends PartialType(CreateMarketDataDto) { }


export class UpdateParameDto {

    @IsMongoId()
    marketDataId: Types.ObjectId

}