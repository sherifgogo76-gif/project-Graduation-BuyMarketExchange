import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { ICategory } from "src/common";



@Schema({ timestamps: true, strictQuery: true })

export class Catgorey implements ICategory {

    @Prop({ type: String, required: true, unique: true, minlength: 2, maxlength: 25 })
    name: string;

    @Prop({ type: String, minlength: 2, maxlength: 50 })
    slug: string;

    @Prop({ type: String, maxlength: 300 })
    description?: string;

    @Prop({ type: String, required: true })
    assetFolderId: string;

    @Prop({ type: [String], required: true })
    images: string[];

    @Prop({ type: Date })
    freezedAt?: Date;

    @Prop({ type: Date })
    restoredAt?: Date;

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "User" })
    updatedBy?: Types.ObjectId;

}
export type CatgoreyDocument = HydratedDocument<Catgorey>
export const CatgoreySchema = SchemaFactory.createForClass(Catgorey)

// ✅ Hook لتوليد slug من الاسم
CatgoreySchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});


//HOOK hard and soft deleteAcount//

CatgoreySchema.pre(["findOne", "find"], function (next) {
    const query = this.getQuery();
    if (query.paranoid === false) {
        this.setQuery({ ...query })
    } else {
        this.setQuery({ ...query, freezedAt: { $exists: false } })
    }
    next()
});


CatgoreySchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {

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



// export const CatgoreyModel = MongooseModule.forFeature([{ name: Catgorey.name, schema: CatgoreySchema }])
