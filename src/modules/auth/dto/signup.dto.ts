import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    Length,
    Matches,
    matches,
    ValidateIf,
} from "class-validator";


export class ResendConfirmEamilBodyDto {
    @IsEmail()
    email: string;
}


export class ConfirmEamilBodyDto extends ResendConfirmEamilBodyDto {
    @Matches(/^\d{6}$/)
    code: string;
}

export class LoginBodyDto extends ResendConfirmEamilBodyDto {
    @IsStrongPassword()
    password: string;
}

export class SignupBodyDto extends LoginBodyDto {
    @Length(2, 52, { message: "username min2 is max 52 character" })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ValidateIf((data: SignupBodyDto) => {
        return Boolean(data.password)
    })
    confirmpassword: string
}

// ✅ تم الإبقاء عليها لأنها شغل زمايلك الجديد من الـ GitHub
export class ForgetPasswordDto extends ResendConfirmEamilBodyDto {
    @IsStrongPassword()
    password: string;

    @ValidateIf((data: ForgetPasswordDto) => {
        return Boolean(data.password)
    })
    confirmpassword: string
}