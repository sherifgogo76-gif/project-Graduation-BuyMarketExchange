import { IsMongoId } from "class-validator";
import { Types } from "mongoose";
import { IUsers } from "src/common";


export class CreateUserDto implements Partial<IUsers> {

    @IsMongoId()
    user: Types.ObjectId
}