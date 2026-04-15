import { InjectModel } from "@nestjs/mongoose";
import { DatabaseRepository } from "./database.repository";
import { Catgorey, CatgoreyDocument as TDocument } from "../model/catgorey.model";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";


@Injectable()

export class CatgoreyRepository extends DatabaseRepository<TDocument> {
    constructor(@InjectModel(Catgorey.name) protected override readonly model: Model<TDocument>) {
        super(model)
    }
}