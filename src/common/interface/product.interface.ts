import { Types } from "mongoose";
import { IUsers } from "./user.interface";
import { ICategory } from "./catgorey.interface";

export interface IProduct {
    _id?: Types.ObjectId;

    // Basic Info
    name: string;
    slug: string;
    description: string;

    // Images
    images: string[];

    // Pricing
    originalprice: number;
    discountprice?: number;
    saleprice: number;
    condition?: string;
    
    // AI Result
    aiResult?: any;


    assetFolderId: string;

    // Category
    category: Types.ObjectId | ICategory ;

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

