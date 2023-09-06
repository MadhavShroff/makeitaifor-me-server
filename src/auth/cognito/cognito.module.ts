import { Module } from '@nestjs/common';
import { UsersModule } from '../../mongo/users/users.module';
import { JwtModule } from '../jwt/jwt.module';
import { CognitoController } from './cognito.controller';
import { CognitoStrategy } from './cognito.strategy';
import { ChatsModule } from 'src/mongo/chats/chats.module';

@Module({
  imports: [UsersModule, JwtModule, ChatsModule],
  controllers: [CognitoController],
  providers: [CognitoStrategy],
})
export class CognitoModule {}
