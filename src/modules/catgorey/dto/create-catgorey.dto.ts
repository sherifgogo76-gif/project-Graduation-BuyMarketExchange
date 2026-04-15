import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Length } from "class-validator";
import { ICategory } from "src/common";

export class CreateCatgoreyDto implements Partial<ICategory> {

    @Length(2, 2000)
    @IsString()
    @IsOptional()
    name: string;

    @Length(2, 2000)
    @IsString()
    @IsOptional()
    description?: string;


}
