import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { CreateMarketDataDto } from './dto/create-market-data.dto';
import { UpdateMarketDataDto, UpdateParameDto } from './dto/update-market-data.dto';
import { Auth, GetUser, IResponse } from 'src/common';
import { endpoint } from './entities/authoraztion';
import type { UserDocument } from 'src/DB/model/user.model';
import { MarketDataResponse } from './entities/marketData.entitiy';
import { successResponse } from 'src/common/response';


@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) { }


  @Auth(endpoint.create)
  @Post()
  async create(
    @Body() createMarketDataDto: CreateMarketDataDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse<MarketDataResponse>> {

    const marketData = await this.marketDataService.create(createMarketDataDto, user);

    return successResponse<MarketDataResponse>({
      status: 201,
      data: { marketData }
    });

  }

  @Auth(endpoint.create)
  @Patch(':marketDataId')
  async update(
    @Param() params: UpdateParameDto,
    @Body() updateMarketDataDto: UpdateMarketDataDto,
    @GetUser() user: UserDocument) {

    const marketData = await this.marketDataService.update(
      params.marketDataId,
      updateMarketDataDto,
      user
    );
    return successResponse<MarketDataResponse>({
      status: 201,
      data: { marketData }
    })
  }

  // freeze marketData
  @Auth(endpoint.create)
  @Delete(':marketDataId/freeze')
  async freeze(
    @Param() params: UpdateParameDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse> {

    await this.marketDataService.freeze(params.marketDataId, user);
    return successResponse();

  }
  //restore marketData
  @Auth(endpoint.create)
  @Get(':marketDataId/restore')
  async restore(
    @Param() params: UpdateParameDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse> {

    await this.marketDataService.restore(params.marketDataId, user);
    return successResponse();

  }
  //Delete marketData
  @Auth(endpoint.create)
  @Delete(':marketDataId')
  async remove(
    @Param() params: UpdateParameDto,
    @GetUser() user: UserDocument
  ): Promise<IResponse> {

    await this.marketDataService.remove(params.marketDataId, user);
    return successResponse();

  }
  // GET ALL MARKET DATA
  @Get()
  async findAll(): Promise<IResponse> {
    const marketData = await this.marketDataService.findAll();

    return successResponse({
      data: { marketData }
    });
  }

  // GET ONE MARKET DATA
  @Get(':marketDataId')
  async findOne(
    @Param() params: UpdateParameDto,
  ): Promise<IResponse> {
    const marketData = await this.marketDataService.findOne(params.marketDataId);

    return successResponse({
      data: { marketData }
    });
  }
}
