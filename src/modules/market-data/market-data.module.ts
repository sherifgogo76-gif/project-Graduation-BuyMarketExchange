import { forwardRef, Module } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { MarketDataController } from './market-data.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MarketDataRepository } from 'src/DB/repository/marketDaTa.repository';
import { MarketData, MarketDataSchema } from 'src/DB/model/marketDate.model';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ProductModule),
    MongooseModule.forFeature([
      { name: MarketData.name, schema: MarketDataSchema },
    ]),
  ],
  controllers: [MarketDataController],
  providers: [MarketDataService, MarketDataRepository],
  exports: [MarketDataService, MarketDataRepository], // مهم
})

export class MarketDataModule { }
