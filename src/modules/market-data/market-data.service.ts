import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMarketDataDto } from './dto/create-market-data.dto';
import { UpdateMarketDataDto } from './dto/update-market-data.dto';
import { UserDocument } from 'src/DB/model/user.model';
import { MarketDataDocument } from 'src/DB/model/marketDate.model';
import { ProductRepository } from 'src/DB/repository/product.repository';
import { MarketDataRepository } from 'src/DB/repository/marketDaTa.repository';
import { Types } from 'mongoose';
import { Lean } from 'src/DB/repository/database.repository';

@Injectable()
export class MarketDataService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly marketDataRepository: MarketDataRepository

  ) { }

  async create(
    createMarketDataDto: CreateMarketDataDto,
    user: UserDocument
  ): Promise<MarketDataDocument> {

    const { productId } = createMarketDataDto;

    const product = await this.productRepository.findOne({
      filter: { _id: productId }
    });

    if (!product) {
      throw new NotFoundException("product not found");
    }

    const marketData = await this.marketDataRepository.create({
      data: [
        {
          ...createMarketDataDto,
          createdBy: user._id
        }
      ]
    });

    return marketData[0];
  }

  async update(
    MarketDataId: Types.ObjectId,
    updateMarketDataDto: UpdateMarketDataDto,
    user: UserDocument
  ): Promise<MarketDataDocument | Lean<MarketDataDocument>> {

    const marketDataFind = await this.marketDataRepository.findOne({
      filter: { _id: MarketDataId }
    });

    if (!marketDataFind) {
      throw new NotFoundException("fail to find  MarketData");
    }

    const MarketData = await this.marketDataRepository.findOneAndUpdate({
      filter: { _id: MarketDataId },
      update: {
        ...updateMarketDataDto,
        updatedBy: user._id
      },
      options: { new: true }
    });

    if (!MarketData) {
      throw new BadRequestException("fail to update category");
    }

    return MarketData;
  }

  // FREEZE
  async freeze(
    MarketDataId: Types.ObjectId,
    user: UserDocument
  ): Promise<string> {

    const marketData = await this.marketDataRepository.findOneAndUpdate({
      filter: { _id: MarketDataId },
      update: {
        freezedAt: new Date(),
        $unset: { restoredAt: true },
        updatedBy: user._id
      },
      options: { new: false }
    });

    if (!marketData) {
      throw new NotFoundException("fail to find MarketData");
    }

    return "Done";
  }

  // RESTORE
  async restore(
    MarketDataId: Types.ObjectId,
    user: UserDocument
  ): Promise<MarketDataDocument | Lean<MarketDataDocument>> {

    const marketData = await this.marketDataRepository.findOneAndUpdate({
      filter: { _id: MarketDataId, paranoid: false, freezedAt: { $exists: true } },
      update: {
        restoredAt: new Date(),
        $unset: { freezedAt: true },
        updatedBy: user._id
      },
      options: { new: false }
    });

    if (!marketData) {
      throw new NotFoundException("fail to find MarketData");
    }

    return marketData;
  }

  // DELETE
  async remove(
    MarketDataId: Types.ObjectId,
    user: UserDocument
  ): Promise<string> {

    const marketData = await this.marketDataRepository.findOneAndDelete({
      filter: { _id: MarketDataId, paranoid: false, freezedAt: { $exists: true } }
    });

    if (!marketData) {
      throw new NotFoundException("fail to find MarketData");
    }

    return "done";
  }
  // GET ALL MARKET DATA
  async findAll() {
    return (await this.marketDataRepository.find({ filter: { paranoid: false } })) as MarketDataDocument[];
  }

  // GET ONE MARKET DATA
  findOne(id: Types.ObjectId) {
    return this.marketDataRepository.findOne({ filter: { _id: id } });
  }
}
