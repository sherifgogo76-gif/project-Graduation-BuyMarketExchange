import { InjectModel } from "@nestjs/mongoose";
import { DatabaseRepository } from "./database.repository";
import { Report, ReportDocument as TDocument } from "../model/reports.model";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";


@Injectable()

export class ReportRepository extends DatabaseRepository<TDocument> {
    constructor(@InjectModel(Report.name) protected override readonly model: Model<TDocument>) {
        super(model)
    }
}