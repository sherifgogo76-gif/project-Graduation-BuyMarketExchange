import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";
import { IProduct } from "src/common";



@Schema({ timestamps: true, strictQuery: true })

export class Product implements IProduct {

    @Prop({ type: String, required: true, unique: true, minlength: 2, maxlength: 25 })
    name: string;

    @Prop({ type: String, required: false, minlength: 2, maxlength: 50 })
    slug: string;

    @Prop({ type: String, maxlength: 300 })
    description: string;

    @Prop({ type: Number, required: true })
    originalprice: number;

    @Prop({ type: Number, default: 0 })
    discountprice: number;

    @Prop({ type: Number, required: true })
    saleprice: number;

    @Prop({ type: String, required: true })
    assetFolderId: string;

    @Prop({ type: String, required: false })
    condition: string;

    @Prop({ type: Types.ObjectId, ref: "Category", required: false })
    category: Types.ObjectId;

    @Prop({ type: [String], required: true })
    images: string[];

    @Prop({ type: Date })
    freezedAt?: Date;

    @Prop({ type: Date })
    restoredAt?: Date;

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "User" })
    updatedBy: Types.ObjectId;

}
export type ProductDocument = HydratedDocument<Product>
export const productSchema = SchemaFactory.createForClass(Product)

// ✅ Hook لتوليد slug من الاسم
productSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});


//HOOK hard and soft deleteAcount//

productSchema.pre(["findOne", "find"], function (next) {
    const query = this.getQuery();
    if (query.paranoid === false) {
        this.setQuery({ ...query })
    } else {
        this.setQuery({ ...query, freezedAt: { $exists: false } })
    }
    next()
});


productSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {

    const update = this.getUpdate() as any;
    if (update?.name) {
        update.slug = slugify(update.name, { lower: true });
    }

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



// export const ProductModel = MongooseModule.forFeature([{ name: Product.name, schema: productSchema }])
