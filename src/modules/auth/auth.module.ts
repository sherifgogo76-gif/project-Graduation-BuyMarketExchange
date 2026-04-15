import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenService } from 'src/common/service';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpRepository } from 'src/DB/repository/otp.repository';
import { UserRepository } from 'src/DB/repository/user.repository';
import { TokenRepository } from 'src/DB/repository/token.repository';
import { User, userSchema } from 'src/DB/model/user.model';
import { Token, tokenSchema } from 'src/DB/model/token.model';
import { Otp, otpSchema } from 'src/DB/model/otp.model';
import { Product, productSchema } from 'src/DB/model/product.model';
import { ProductRepository } from 'src/DB/repository/product.repository';
import { CatgoreyRepository } from 'src/DB/repository/catgorey.repositorey';
import { Catgorey, CatgoreySchema } from 'src/DB/model/catgorey.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Token.name, schema: tokenSchema },
      { name: Otp.name, schema: otpSchema },
      // { name: Product.name, schema: productSchema },
      // { name: Catgorey.name, schema:CatgoreySchema}


    ]),
  ],
  controllers: [AuthController],
  
  providers: [
    AuthService,
    UserRepository,
    OtpRepository,
    TokenService,
    JwtService,
    TokenRepository,
    // ProductRepository,
    // CatgoreyRepository
  ],
  exports: [AuthService, TokenService, UserRepository]
})
export class AuthModule { }
