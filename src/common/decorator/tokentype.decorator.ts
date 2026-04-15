import { SetMetadata } from "@nestjs/common";
import { TokentypeEnum } from "../enums";

 export const tokenName = "tokentype"
export const Token = (type: TokentypeEnum = TokentypeEnum.access) => {
    return SetMetadata(type, tokenName)
}