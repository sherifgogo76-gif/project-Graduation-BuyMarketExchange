import { Types } from "mongoose";
import { IUsers } from "./user.interface";
import { StatusEnum } from "../enums";
import { IProduct } from "./product.interface";

export interface IMarketData {

    _id?: Types.ObjectId;

    // market data Target
    productId: Types.ObjectId | IProduct;

    //price
    averagePrice: number;

    minPrice?: number;

    maxprice?: number;

    listingsCount?: number;


    // Users
    createdBy: Types.ObjectId | IUsers;
    updatedBy?: Types.ObjectId | IUsers;

    // States
    freezedAt?: Date;
    restoredAt?: Date;

    // Timestamps
    createdAt?: Date;
    updatedAt?: Date;

}