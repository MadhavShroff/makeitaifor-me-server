import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CognitoModule } from './cognito/cognito.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [CognitoModule, JwtModule],
})
export class AuthModule {}
