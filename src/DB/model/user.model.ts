import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { GenderEnum, IUsers, ProviderEnum, RoleEnum } from "src/common";
import { GenerateHash } from "src/common/utiles";
import { OtpDocument } from "./otp.model";
import slugify from "slugify";
import { types } from "util";

@Schema({
    strictQuery: true,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

export class User implements IUsers {

    @Prop({
        type: String,
        required: false,
        minlength: 2,
        maxlength: 25,
        trim: true,
    })
    firstname: string;

    @Prop({
        type: String,
        required: false,
        minlength: 2,
        maxlength: 25,
        trim: true,
    })
    lastname: string;


    @Virtual({
        get: function (this: User) {
            return this.firstname + " " + this.lastname
        },
        set: function (value: string) {
            const [firstname, lastname] = value.split(" ");
            this.set({ firstname, lastname });
        }
    })
    username: string;

    @Prop({
        type: String,
        unique: true,
        required: true,

    })
    email: string;

    @Prop({
        type: Date,
    })
    confirmemail: Date;

    @Prop({
        type: String,
        required: function (this: User) {
            return this.provider === ProviderEnum.GOOGLE ? false : true;
        }

    })
    password: string;

    @Prop({
        type: String,
        enum: ProviderEnum,
        default: ProviderEnum.SYSTEM
    })
    provider: ProviderEnum;


    @Prop({
        type: String,
        enum: GenderEnum,
        default: GenderEnum.male
    })
    gender: GenderEnum;

    @Prop({
        type: String,
        enum: RoleEnum,
        default: RoleEnum.user
    })
    role: RoleEnum;

    @Prop({ type: Types.ObjectId, ref: "IUsers" })
    user: IUsers | Types.ObjectId;


    @Prop({
        type: String,
    })
    profilePicture: string;

    @Prop({ type: [String] })
    coverImages: string[];
    
    @Prop({ type: [String], required: true })
    images: string[];


    @Prop({
        type: Date,
        required: false,
    })
    confirmedAt: Date;


    @Prop({
        type: Date,
        required: false,
    })
    ChangeCredentialsTime: Date;

    @Virtual()
    otp: OtpDocument[]



}
export const userSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;

userSchema.virtual("otp", {
    localField: "_id",
    foreignField: "createdBy",
    ref: "Otp"
})



//HOOKS generate password
userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await GenerateHash(this.password)
        next();
    }

});


userSchema.pre(["findOne", "find"], function (next) {
    const query = this.getQuery();
    if (query.paranoid === false) {
        this.setQuery({ ...query })
    } else {
        this.setQuery({ ...query, freezedAt: { $exists: false } })
    }
    next()
});


userSchema.pre(['updateOne', 'findOneAndUpdate'], function (next) {

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

// export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: userSchema }])
