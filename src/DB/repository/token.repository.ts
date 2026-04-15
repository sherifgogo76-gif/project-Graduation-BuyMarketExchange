import { InjectModel } from "@nestjs/mongoose";
import { DatabaseRepository } from "./database.repository";
import {  TokenDocument as TDocument, Token } from "../model/token.model";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";


@Injectable()

export class TokenRepository extends DatabaseRepository<TDocument> {
    constructor(@InjectModel(Token.name) protected override readonly model: Model<TDocument>) {
        super(model)
    }
}