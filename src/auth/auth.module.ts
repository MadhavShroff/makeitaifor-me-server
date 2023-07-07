import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CognitoModule } from './cognito/cognito.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  controllers: [AuthController],
  imports: [CognitoModule, JwtModule],
})
export class AuthModule {}
