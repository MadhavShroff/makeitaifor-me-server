import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CognitoModule } from './cognito/cognito.module';
import { JwtModule } from './jwt/jwt.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  imports: [CognitoModule, JwtModule, PassportModule],
})
export class AuthModule {}
