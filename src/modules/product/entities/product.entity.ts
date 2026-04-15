import { IProduct } from "src/common";

export class ProductResponse {
    product: IProduct;
    aiResult?: {
        predictedPrice: number;
        minPrice: number;
        maxPrice: number;
        condition?: string;
    };
}