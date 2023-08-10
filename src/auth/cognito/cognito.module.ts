import { Module } from '@nestjs/common';
import { UsersModule } from '../../mongo/users/users.module';
import { JwtModule } from '../jwt/jwt.module';
import { CognitoController } from './cognito.controller';
import { CognitoStrategy } from './cognito.strategy';

@Module({
  imports: [UsersModule, JwtModule],
  controllers: [CognitoController],
  providers: [CognitoStrategy],
})
export class CognitoModule {}
