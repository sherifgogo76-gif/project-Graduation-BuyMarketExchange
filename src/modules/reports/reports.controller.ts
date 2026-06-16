import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Get
} from '@nestjs/common';

import { ReportsService } from './reports.service';
import { UpdateReportDto, UpdateParameDto } from './dto/update-report.dto';
import { Auth, GetUser, IResponse } from 'src/common';
import type { UserDocument } from 'src/DB/model/user.model';
import { successResponse } from 'src/common/response';
import { endpoint } from './authoraztion';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportResponse } from './entities/report.entity';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('report')
export class ReportsController {

  constructor(private readonly reportsService: ReportsService) { }

  // create report
  @Auth(endpoint.create)
  @Post()
  async create(
    @Body() createReportDto: CreateReportDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse<ReportResponse>> {
    
    console.log("BODY:", createReportDto);

    const report = await this.reportsService.create(createReportDto, user);

    return successResponse<ReportResponse>({
      status: 201,
      data: { report }
    });

  }

  // update report
  @Auth(endpoint.create)
  @Patch(':reportId')
  async update(
    @Param() params: UpdateParameDto,
    @Body() updateReportDto: UpdateReportDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse<ReportResponse>> {

    const report = await this.reportsService.update(
      params.reportId,
      updateReportDto,
      user
    );

    return successResponse<ReportResponse>({
      status: 201,
      data: { report }
    });

  }

  // freeze report
  @Auth(endpoint.create)
  @Delete(':reportId/freeze')
  async freeze(
    @Param() params: UpdateParameDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse> {

    await this.reportsService.freeze(params.reportId, user);
    return successResponse();

  }

  // // restore report
  @Auth(endpoint.create)
  @Get(':reportId/restore')
  async restore(
    @Param() params: UpdateParameDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse> {

    await this.reportsService.restore(params.reportId, user);
    return successResponse();

  }

  // // delete report
  @Auth(endpoint.create)
  @Delete(':reportId')
  async remove(
    @Param() params: UpdateParameDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse> {

    await this.reportsService.remove(params.reportId, user);
    return successResponse();

  }

  // GET ALL REPORTS
  @Get()
  async findAll(): Promise<IResponse> {
    const reports = await this.reportsService.findAll();

    return successResponse({
      data: { reports }
    });
  }

  // GET ONE REPORT
  @Get(':reportId')
  async findOne(
    @Param() params: UpdateParameDto,
  ): Promise<IResponse> {
    const report = await this.reportsService.findOne(params.reportId);

    return successResponse({
      data: { report }
    });
  }

}
