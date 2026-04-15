import { InjectModel } from "@nestjs/mongoose";
import { DatabaseRepository } from "./database.repository";
import { MarketData, MarketDataDocument as TDocument } from "../model/marketDate.model";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";


@Injectable()

export class MarketDataRepository extends DatabaseRepository<TDocument> {
    constructor(@InjectModel(MarketData.name) protected override readonly model: Model<TDocument>) {
        super(model)
    }
}