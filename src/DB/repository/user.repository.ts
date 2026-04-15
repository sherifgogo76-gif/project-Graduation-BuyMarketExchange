import { InjectModel } from "@nestjs/mongoose";
import { DatabaseRepository } from "./database.repository";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { User, UserDocument as TDocument } from "../model/user.model";


@Injectable()

export class UserRepository extends DatabaseRepository<TDocument> {
    constructor(@InjectModel(User.name) protected override readonly model: Model<TDocument>) {
        super(model)
    }
}