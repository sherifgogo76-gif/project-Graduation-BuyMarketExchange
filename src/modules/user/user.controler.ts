import { Controller, Delete, Get, Param, Patch, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth, GetUser, RoleEnum, storageEnum } from "src/common";
import type { UserDocument } from "src/DB/model/user.model";
import type { IMulter, IResponse } from '../../common/interface'
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { FileValidation } from "src/common/utiles/multer/validation.multer";
import { localFiledUpload } from "src/common/utiles/multer/local.multer.options";
import { cloudFiledUpload } from "src/common/utiles/multer/cloud.multer.options";
import { ProfileResponse } from "./user.enitity";
import { successResponse } from "src/common/response";
import { endpoint } from "./authoraztion";
import { UpdateParameDto } from "./dto/update-user.dto";

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Auth([RoleEnum.admin, RoleEnum.user])
    @Get()
    profile(@GetUser() user: UserDocument): { message: string, data: { user: UserDocument } } {
        console.log({ user });
        return { message: "done", data: { user } }
    }

    // 2️⃣ [GET ALL USERS] تم تحديد صلاحية الـ Admin لها فقط عشان الـ NestJS يفرق بينها وبين الـ Profile
    @Auth([RoleEnum.admin])
    @Get()
    async findAll(): Promise<IResponse> {
        const users = await this.userService.findAll();
        return successResponse({
            data: { users }
        });
    }

    // 3️⃣ [PROFILE IMAGE]
    @UseInterceptors(FileInterceptor(
        'image',
        cloudFiledUpload({
            storageapproch: storageEnum.memory,
            validation: FileValidation.image,
            fileSize: 2
        })))
    @Auth(endpoint.create)
    @Patch('profile-image')
    async profileimage(
        @GetUser() user: UserDocument,
        @UploadedFile() file: Express.Multer.File
    ): Promise<IResponse<ProfileResponse>> {
        console.log({ file });
        const profile = await this.userService.profileimage(file, user)
        return successResponse<ProfileResponse>({ message: 'done', data: { profile } })
    }

    // 4️⃣ [COVER IMAGE]
    @UseInterceptors(FilesInterceptor(
        'images',
        2,
        cloudFiledUpload({
            storageapproch: storageEnum.memory,
            validation: FileValidation.image,
            fileSize: 2
        })
    ))
    @Auth(endpoint.create)
    @Patch('profile-cover-image')
    async coverimage(
        @GetUser() user: UserDocument,
        @UploadedFiles() files: Express.Multer.File[]
    ): Promise<IResponse<ProfileResponse>> {
        console.log({ files });
        const profile = await this.userService.coverimage(files, user);
        return successResponse<ProfileResponse>({ message: 'done', data: { profile } });
    }

    // 5️⃣ [FREEZE USER]
    @Auth(endpoint.create)
    @Delete(':userId/freeze')
    async freeze(
        @Param() params: UpdateParameDto,
        @GetUser() user: UserDocument
    ): Promise<IResponse> {
        await this.userService.freeze(params.userId, user)
        return successResponse();
    }

    // 6️⃣ [RESTORE USER]
    @Auth(endpoint.create)
    @Get(':userId/restore')
    async restore(
        @Param() params: UpdateParameDto,
        @GetUser() user: UserDocument
    ): Promise<IResponse> {
        await this.userService.restore(params.userId, user)
        return successResponse();
    }

    // 7️⃣ [DELETE USER]
    @Auth(endpoint.create)
    @Delete(':userId')
    async remove(
        @Param() params: UpdateParameDto,
        @GetUser() user: UserDocument
    ): Promise<IResponse> {
        await this.userService.remove(params.userId, user)
        return successResponse();
    }


    @Get(':userId')
    async findOne(
        @Param() params: UpdateParameDto, 
    ): Promise<IResponse> {
        const user = await this.userService.findOne(params.userId);
        return successResponse({
            data: { user }
        });
    }
}
