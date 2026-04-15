import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ timestamps: true, strictQuery: true })

export class MarketData {

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    createdBy: Types.ObjectId; // المستخدم اللي أنشأ البيانات

    @Prop({ type: Types.ObjectId, ref: "Product", required: true })
    productId: Types.ObjectId; // المنتج المرتبط ببيانات السوق

    @Prop({ type: Number, required: true })
    averagePrice: number; // متوسط السعر في السوق

    @Prop({ type: Number })
    minPrice?: number; // أقل سعر

    @Prop({ type: Number })
    maxPrice?: number; // أعلى سعر

    @Prop({ type: Number, default: 0 })
    listingsCount?: number; // عدد المنتجات المشابهة في السوق

    @Prop({ type: Date })
    freezedAt?: Date;

    @Prop({ type: Date })
    restoredAt?: Date;

    @Prop({ type: Types.ObjectId, ref: "User" })
    updatedBy?: Types.ObjectId;

}

export type MarketDataDocument = HydratedDocument<MarketData>
export const MarketDataSchema = SchemaFactory.createForClass(MarketData)


// HOOK soft delete handling

MarketDataSchema.pre(["findOne", "find"], function (next) {
    const query = this.getQuery();
    if (query.paranoid === false) {
        this.setQuery({ ...query })
    } else {
        this.setQuery({ ...query, freezedAt: { $exists: false } })
    }
    next()
});


MarketDataSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {

    const update = this.getUpdate() as any;

    // soft delete filter handling
    const query = this.getQuery();
    if (query.paranoid === false) {
        this.setQuery({ ...query });
    } else {
        this.setQuery({ ...query, freezedAt: { $exists: false } });
    }

    this.setUpdate(update);

    next();
});