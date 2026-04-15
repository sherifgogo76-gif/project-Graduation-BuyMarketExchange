import { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";
import { TokentypeEnum } from "../enums";
import { Types } from "mongoose";
import { IUsers } from "./user.interface";
import { UserDocument } from "src/DB/model/user.model";




export interface IToken {

    _id?: Types.ObjectId;

    jti: string;
    expiredAt: Date;

    createdBy: Types.ObjectId | IUsers;



    createdAt?: Date;
    updatedAt?: Date;



}
export interface ICredentials {
    user: UserDocument;
    decoded: JwtPayload;
    tokentype: TokentypeEnum;
}
export interface IAuthRequest extends Request {
    credentials: ICredentials;
}