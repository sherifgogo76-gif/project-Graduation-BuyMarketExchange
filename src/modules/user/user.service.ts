import { Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { S3Service } from "src/common/service/s3.service";
import { UserDocument } from "src/DB/model/user.model";
import { Lean } from "src/DB/repository/database.repository";
import { UserRepository } from "src/DB/repository/user.repository";



@Injectable()
export class UserService {
    constructor(
        private readonly s3Service: S3Service,
        private readonly userRepository: UserRepository
    ) { }

    // profile() {
    //     return "Done"
    // }


    async profileimage(
        file: Express.Multer.File,
        user: UserDocument
    ): Promise<UserDocument> {
        user.profilePicture = await this.s3Service.uploadFile({ file, path: `user/${user._id.toString()}` })
        await user.save();
        return user;

    }

    async coverimage(
        files: Express.Multer.File[],
        user: UserDocument
    ): Promise<UserDocument> {
        user.coverImages = await this.s3Service.uploadFiles({ files, path: `user/${user._id.toString()}/cover` })
        return user.save()
        return user
    }

    async freeze(
        userId: Types.ObjectId,
        user: UserDocument
    ): Promise<string> {

        const userr = await this.userRepository.findOneAndUpdate({
            filter: { _id: userId },
            update: {
                freezedAt: new Date(),
                $unset: { restored: true },
                updatedBy: user._id
            },
            options: { new: false }
        })
        if (!userr) {
            throw new NotFoundException("fail to find user")
        }
        return "done"


    }

     async restore(
       userId: Types.ObjectId,
       user: UserDocument
     ): Promise<UserDocument | Lean<UserDocument>> {
   
   
       const userr = await this.userRepository.findOneAndUpdate({
         filter: { _id: userId, paranoid: false, freezedAt: { $exists: true } },
   
         update: {
           restoredAt: new Date(),
           $unset: { freezedAt: true },
           updatedBy: user._id
         },
         options: {
           new: false,
         },
       });
   
       if (!userr) {
         throw new NotFoundException("fail to the find userr");
       }
   
       return userr;
     }
   
     async remove(
       userId: Types.ObjectId,
       user: UserDocument
     ): Promise<string> {
   
       const userr = await this.userRepository.findOneAndDelete({
   
         filter: { _id: userId, paranoid: false, freezedAt: { $exists: true } },
       });
   
       if (!userr) {
         throw new NotFoundException("fail to the find userr");
       }
       await this.s3Service.deleteFiles({ urls: user.images })
       return "done";
     }

    // GET ALL USERS
  async findAll(): Promise<UserDocument[]> {
    return (await this.userRepository.find({ filter: { paranoid: false } })) as UserDocument[];
  }

  // GET ONE USER
  findOne(id: Types.ObjectId) {
    return this.userRepository.findOne({ filter: { _id: id } });
  }


}

