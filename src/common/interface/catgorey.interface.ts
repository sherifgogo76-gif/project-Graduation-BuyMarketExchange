import { Types } from "mongoose";
import { IUsers } from "./user.interface";

export interface ICategory {
    _id?: Types.ObjectId;

    // Basic Info
    name: string;
    slug: string;
    description?: string;

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
