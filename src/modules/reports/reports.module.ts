import { forwardRef, Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from 'src/DB/model/reports.model';
import { ReportRepository } from 'src/DB/repository/reports.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    ProductModule,
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema }
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ReportRepository],
  exports: [ReportsService, ReportRepository]
})
export class ReportsModule { }