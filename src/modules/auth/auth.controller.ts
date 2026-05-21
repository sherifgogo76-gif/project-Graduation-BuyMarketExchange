import { Controller, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmEamilBodyDto, ResendConfirmEamilBodyDto, SignupBodyDto,ForgetPasswordDto } from './dto/signup.dto';
import { successResponse } from 'src/common/response';
import { IResponse } from 'src/common';
import { LoginResponse } from './entites/auth.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("signup")
  async signup(@Body() body: SignupBodyDto): Promise<IResponse> {
    await this.authService.signup(body);
    console.log(body);
    return successResponse()
  }

  @Post("login")
  async login(@Body() body: SignupBodyDto): Promise<IResponse<LoginResponse>> {
    const credentials = await this.authService.login(body);
    console.log(body);

    return successResponse<LoginResponse>({
      message: "Done",
      data: { credentials }
    });
  }

  @Patch("Confirm_Email")
  async confirmEmail(@Body() body: ConfirmEamilBodyDto): Promise<IResponse> {
    console.log(body);
    await this.authService.confirmEmail(body);
    return successResponse()
  }

  @Post("Resend_Confirm_Email")
  async resendconfirmEmail(@Body() body: ResendConfirmEamilBodyDto): Promise<IResponse> {
      console.log(body);
      await this.authService.resendconfirmEmail(body);
      return successResponse()
  }
 @Post('forget-password')
async forgetPassword(@Body() body: ForgetPasswordDto):Promise<string> {
   console.log(body); 
   await this.authService.forgetPassword(body);
     return successResponse()
}

}
