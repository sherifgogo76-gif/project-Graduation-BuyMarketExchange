import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthModule } from "../auth/auth.module";
import { UserController } from "./user.controler";
import { AuthenticationGuard } from "src/common/guards/authentication/authentication.guard";
import { Reflector } from "@nestjs/core";
import { AuthorizationGuard } from "src/common/guards/authorization/authorization.guard";
import { S3Service } from "src/common/service/s3.service";


@Module({
    imports: [forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [UserService, AuthenticationGuard, AuthorizationGuard, Reflector, S3Service],
    exports: [UserService],
})
export class UserModule { }
