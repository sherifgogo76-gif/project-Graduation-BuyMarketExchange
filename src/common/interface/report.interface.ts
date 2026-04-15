import { Types } from "mongoose";
import { IUsers } from "./user.interface";
import { StatusEnum } from "../enums";
import { IProduct } from "./product.interface";

export interface IReports {

    _id?: Types.ObjectId;

    // Report Target
    productId: Types.ObjectId | IProduct;

    // Reason
    reason: string;

    // Status
    status?:StatusEnum;

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