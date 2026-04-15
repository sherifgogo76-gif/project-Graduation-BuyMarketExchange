import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ProductRepository } from 'src/DB/repository/product.repository';
import { ReportRepository } from 'src/DB/repository/reports.repository';
import { UserDocument } from 'src/DB/model/user.model';
import { ReportDocument } from 'src/DB/model/reports.model';
import { Types } from 'mongoose';
import { Lean } from 'src/DB/repository/database.repository';

@Injectable()
export class ReportsService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly reportRepository: ReportRepository
  ) { }

  async create(
    createReportDto: CreateReportDto,
    user: UserDocument
  ): Promise<ReportDocument> {

    const { productId } = createReportDto;

    const product = await this.productRepository.findOne({
      filter: { _id: productId }
    });

    if (!product) {
      throw new NotFoundException("product not found");
    }

    const report = await this.reportRepository.create({
      data: [
        {
          ...createReportDto,
          createdBy: user._id
        }
      ]
    });

    return report[0];

  }


  async update(
    reportId: Types.ObjectId,
    updatereportDto: UpdateReportDto,
    user: UserDocument
  ): Promise<ReportDocument | Lean<ReportDocument>> {

    const reportFind = await this.reportRepository.findOne({
      filter: { _id: reportId }
    });

    if (!reportFind) {
      throw new NotFoundException("fail to find report");
    }

    const report = await this.reportRepository.findOneAndUpdate({
      filter: { _id: reportId },
      update: {
        ...updatereportDto,
        updatedBy: user._id
      },
      options: { new: true }
    });

    if (!report) {
      throw new BadRequestException("fail to update category");
    }

    return report;
  }


  // FREEZE
  async freeze(
    reportId: Types.ObjectId,
    user: UserDocument
  ): Promise<string> {

    const report = await this.reportRepository.findOneAndUpdate({
      filter: { _id: reportId },
      update: {
        freezedAt: new Date(),
        $unset: { restoredAt: true },
        updatedBy: user._id
      },
      options: { new: false }
    });

    if (!report) {
      throw new NotFoundException("fail to find report");
    }

    return "Done";
  }

  // RESTORE
  async restore(
    reportId: Types.ObjectId,
    user: UserDocument
  ): Promise<ReportDocument | Lean<ReportDocument>> {

    const report = await this.reportRepository.findOneAndUpdate({
      filter: { _id: reportId, paranoid: false, freezedAt: { $exists: true } },
      update: {
        restoredAt: new Date(),
        $unset: { freezedAt: true },
        updatedBy: user._id
      },
      options: { new: false }
    });

    if (!report) {
      throw new NotFoundException("fail to find report");
    }

    return report;
  }

  // DELETE
  async remove(
    reportId: Types.ObjectId,
    user: UserDocument
  ): Promise<string> {

    const report = await this.reportRepository.findOneAndDelete({
      filter: { _id: reportId, paranoid: false, freezedAt: { $exists: true } }
    });

    if (!report) {
      throw new NotFoundException("fail to find report");
    }

    return "done";
  }



  // findAll() {
  //   return `This action returns all reports`;
  // }


}
