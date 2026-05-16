import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { CatgoreyModule } from './modules/catgorey/catgorey.module';
import { ReportsModule } from './modules/reports/reports.module';
import { MarketDataModule } from './modules/market-data/market-data.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      envFilePath: resolve("./config/.env.development"),      //conect config//
      isGlobal: true,
    }),

    MongooseModule.forRoot(process.env.DB_URI as string, { serverSelectionTimeoutMS: 5000}),
    AuthModule,
    UserModule,
    ProductModule,
    CatgoreyModule,
    ReportsModule,
    MarketDataModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
