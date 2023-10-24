import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CognitoModule } from './cognito/cognito.module';
import { JwtModule } from './jwt/jwt.module';
import { PassportModule } from '@nestjs/passport';
import { ChatsModule } from 'src/mongo/chats/chats.module';
import { UsersModule } from 'src/mongo/users/users.module';

@Module({
  controllers: [AuthController],
  imports: [CognitoModule, JwtModule, PassportModule, ChatsModule, UsersModule],
})
export class AuthModule {}
