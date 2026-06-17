import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";
import { RoleEnum, signatureLevelEnum, TokentypeEnum } from "../enums";
import { randomUUID } from "crypto";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { LoginCredentialsResponse } from "../entites";
import { UserDocument } from "src/DB/model/user.model";
import { UserRepository } from "src/DB/repository/user.repository";
import { TokenRepository } from "src/DB/repository/token.repository";


@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly tokenRepository: TokenRepository,
        @Inject(forwardRef(() => UserRepository))
        private readonly userRepository: UserRepository
    ) { }


    generatetoken = async ({
        payload,
        options = {
            secret: process.env.ACCESS_USER_TOKEN_SIGNATURE as string,
            expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
        },
    }: {
        payload: object;
        options?: JwtSignOptions;
    }): Promise<string> => {
        return await this.jwtService.signAsync(payload, options);
    };

    verifytoken = async ({
        token,
        options = {
            secret: process.env.ACCESS_USER_TOKEN_SIGNATURE as string,
        }

    }: {
        token: string;
        options?: JwtVerifyOptions;

    }): Promise<JwtPayload> => {
        return this.jwtService.verifyAsync(token, options) as unknown as JwtPayload;
    };


    detectedSignatureLevel = async (
        role: RoleEnum = RoleEnum.user
    ) => {
        let signatureLevel: signatureLevelEnum = signatureLevelEnum.Bearer;

        switch (role) {
            case RoleEnum.admin:
            case RoleEnum.superadmin:
                signatureLevel = signatureLevelEnum.System;
                break;

            default:
                signatureLevel = signatureLevelEnum.Bearer;
                break;
        }

        return signatureLevel;
    };


    getsignatures = async (
        signatureLevel: signatureLevelEnum = signatureLevelEnum.Bearer
    ): Promise<{ access_Signature: string; refresh_Signature: string }> => {

        let signatures: { access_Signature: string; refresh_Signature: string } = {
            access_Signature: "",
            refresh_Signature: "",
        };

        switch (signatureLevel) {
            case signatureLevelEnum.System:
                signatures.access_Signature = process.env.ACCESS_SYSTEM_TOKEN_SIGNATURE as string;
                signatures.refresh_Signature = process.env.REFRESH_SYSTEM_TOKEN_SIGNATURE as string;
                break;

            case signatureLevelEnum.Bearer:

            default:
                signatures.access_Signature = process.env.ACCESS_USER_TOKEN_SIGNATURE as string;
                signatures.refresh_Signature = process.env.REFRESH_USER_TOKEN_SIGNATURE as string;
                break;
        }


        if (!signatures.access_Signature || !signatures.refresh_Signature) {
            throw new BadRequestException('Invalid bearer type');
        }

        return signatures;
    };


    generateLoginCredential = async (user: UserDocument): Promise<LoginCredentialsResponse> => {

        const signatureLevel = await this.detectedSignatureLevel(user.role);
        const signatures = await this.getsignatures(signatureLevel);

        console.log({ signatures });
        const jwtid = randomUUID();
        const access_token = await this.generatetoken({
            payload: { sub: user._id.toString() },
            options: {
                secret: signatures.access_Signature,
                expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
                jwtid
            },
        });

        const refresh_token = await this.generatetoken({
            payload: { sub: user._id.toString() },
            options: {
                secret: signatures.refresh_Signature,
                expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
                jwtid
            },
        });

        return { access_token, refresh_token };
    };


    // -------------------- Decode Token --------------------
    decodedToken = async ({
        authorization,
        tokentype = TokentypeEnum.access,
    }: {
        authorization: string;
        tokentype?: TokentypeEnum;
    }) => {

        try {

            // const [bearer, token] = authorization.split(" ");
            // if (!bearer || !token) {
            //     throw new UnauthorizedException("Invalid token format");
            // }

            // لو باعت التوكن حاف، الـ bearer هيبقى 'user' والـ token هياخد القيمة كلها
            const cleanAuth = authorization || "";
            const isCleanToken = !cleanAuth.includes(" ");
            const bearer = isCleanToken ? 'user' : cleanAuth.split(" ")[0];
            const token = isCleanToken ? cleanAuth.trim() : cleanAuth.split(" ")[1]; 

            const signatures = await this.getsignatures(bearer as signatureLevelEnum);
            const decoded = await this.verifytoken({
                token,
                options: {
                    secret: tokentype === TokentypeEnum.access ?
                        signatures.access_Signature
                        : signatures.refresh_Signature

                }

            })

            console.log("🧩 Decoded token content:", decoded);


            if (!(decoded?.sub || decoded?._id) || !decoded?.iat) {
                throw new BadRequestException("Invalid or expired token");
            }

            if (await this.tokenRepository.findOne({ filter: { jti: decoded.jti } })) {
                throw new UnauthorizedException("invalid or login credenatial");
            }

            const user = await this.userRepository.findOne({
                filter: { _id: decoded.sub || decoded._id },
            }) as UserDocument;

            if (!user) {
                throw new BadRequestException("Not register account");
            }

            return { user, decoded };


        } catch (error) {
            // throw error instanceof Error ? error : new InternalServerErrorException("Something went wrong!");
            console.error("Token verification failed:", error);
            if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException(error instanceof Error ? error.message : "Invalid token");

        }
    };

}
