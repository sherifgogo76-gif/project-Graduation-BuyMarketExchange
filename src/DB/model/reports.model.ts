import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { StatusEnum } from "src/common";
import { IReports } from "src/common/interface/report.interface";

@Schema({ timestamps: true, strictQuery: true })

export class Report implements IReports {

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    createdBy: Types.ObjectId; // المستخدم اللي عمل البلاغ

    @Prop({ type: Types.ObjectId, ref: "Product", required: true })
    productId: Types.ObjectId; // المنتج المبلغ عنه

    @Prop({ type: String, required: true, minlength: 3, maxlength: 200 })
    reason: string; // سبب البلاغ

    @Prop({
        type: String,
        enum: StatusEnum,
        default: StatusEnum.pending
    })
    status: StatusEnum;

    @Prop({ type: Date })
    freezedAt?: Date;

    @Prop({ type: Date })
    restoredAt?: Date;

    @Prop({ type: Types.ObjectId, ref: "User" })
    updatedBy?: Types.ObjectId;

}

export type ReportDocument = HydratedDocument<Report>
export const ReportSchema = SchemaFactory.createForClass(Report)

//HOOK hard and soft deleteAcount//

ReportSchema.pre(["findOne", "find"], function (next) {
    const query = this.getQuery();
    if (query.paranoid === false) {
        this.setQuery({ ...query })
    } else {
        this.setQuery({ ...query, freezedAt: { $exists: false } })
    }
    next()
});


ReportSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {

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