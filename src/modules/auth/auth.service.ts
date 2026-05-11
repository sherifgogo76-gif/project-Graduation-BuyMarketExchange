import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfirmEamilBodyDto, ResendConfirmEamilBodyDto, SignupBodyDto } from './dto/signup.dto';
import { UserRepository } from 'src/DB/repository/user.repository';
import { OtpRepository } from 'src/DB/repository/otp.repository';
import { generateNumberOtp } from 'src/common/otp';
import { Types } from 'mongoose';
import { IUsers, LoginCredentialsResponse, OtpEnum, ProviderEnum } from 'src/common';
import { CompareHash, emailevent } from 'src/common/utiles';
import { TokenService } from 'src/common/service';
import { UserDocument } from 'src/DB/model/user.model';

@Injectable()
export class AuthService {
  private users: IUsers[] = []
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OtpRepository,
    private readonly tokenService: TokenService
  ) { }

  async CreateConfirmEmailotp(userId: Types.ObjectId) {

    await this.otpRepository.create({
      data: [
        {
          code: generateNumberOtp().toString(),
          expiredAt: new Date(Date.now() + 2 * 60 * 1000),
          createdBy: userId,
          otp: OtpEnum.ConfirmEmail,
        }
      ]
    })
  }


  async signup(data: SignupBodyDto) {
  try {
    console.log("START SIGNUP");

    const { username, password, email } = data;

    console.log("STEP 1");

    const CheckUserExist = await this.userRepository.findOne({
      filter: { email },
    });

    console.log("STEP 2");

    if (CheckUserExist) throw new ConflictException("Email exists");

    const users = await this.userRepository.create({
      data: [{ username, email, password }],
    });

    console.log("STEP 3 DONE");
    
      const user = users?.[0];
    if (!user) {
      throw new BadRequestException("Failed to create user");
    }

await this.CreateConfirmEmailotp(user._id);
    
    return "Done";
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    throw err;
  }
}


  // async signup(data: SignupBodyDto): Promise<string> {
  //   const { username, password, email } = data;

  //   const CheckUserExist = await this.userRepository.findOne({
  //     filter: { email },
  //   });
  //   if (CheckUserExist) {
  //     throw new ConflictException("Email already exists");
  //   }

  //   // إنشاء المستخدم
  //   const users = await this.userRepository.create({
  //     data: [
  //       {

  //         username,
  //         email,
  //         password,
  //       }
  //     ]
  //   }
  //   );
  //   const user = users?.[0];
  //   if (!user) {
  //     throw new BadRequestException("Failed to create user");
  //   }

  //   // await this.CreateConfirmEmailotp(user._id);

  //   return "Done";
  // }




  async login(data: SignupBodyDto): Promise<LoginCredentialsResponse> {
    const { password, email } = data;

    const user = await this.userRepository.findOne({
      filter: {
        email,
        confirmedAt: { $exists: false },
        provider: ProviderEnum.SYSTEM
      }
    })
    if (!user) {
      throw new BadRequestException("fail to find user")
    }

    const isMatched = await CompareHash(password, user.password)
    if (!isMatched) {
      throw new NotFoundException("no matched the password")
    }
    return await this.tokenService.generateLoginCredential(user as UserDocument)
  }
  

  async confirmEmail(data: ConfirmEamilBodyDto): Promise<string> {
    const { email, code } = data;

    const user = await this.userRepository.findOne({
      filter: { email, confirmedAt: { $exists: false } },
    });
    if (!user) {
      throw new NotFoundException("Failed to find match account user");
    }
    //هات اخر otp//
    const otp = await this.otpRepository.findOne({
      filter: { createdBy: user._id, otp: OtpEnum.ConfirmEmail },
      options: { sort: { createdAt: -1 } },
    });

    if (!otp) {
      throw new BadRequestException("OTP not found or expired");
    }

    const isMatch = await CompareHash(code, otp.code);
    if (!isMatch) {
      throw new BadRequestException("Invalid OTP code");
    }

    // ✅ تم التحقق
    user.confirmedAt = new Date();
    await user.save();
    await this.otpRepository.deleteOne({ filter: { _id: otp._id } });

    return "Done";
  }
  async resendconfirmEmail(data: ResendConfirmEamilBodyDto): Promise<string> {
    const { email } = data;

    const user = await this.userRepository.findOne({
        filter: { email, confirmedAt: { $exists: false } },
        options: {
            populate: [{ path: "otp", match: { otp: OtpEnum.ConfirmEmail } }]
        }
    });

    if (!user) {
        throw new NotFoundException("Failed to find match account user");
    }

    if (user.otp?.length) {
        throw new ConflictException("sorry to the find otp exists")
    }
    await this.CreateConfirmEmailotp(user._id);

    return "Done";
}

}
