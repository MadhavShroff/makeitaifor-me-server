// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './mongo/users/users.module';
import { FileUploadModule } from './fileupload/fileupload.module';
import { AppGateway } from './gateway/app.gateway';
import { LangChainService } from './lang-chain/lang-chain.service';
import { JwtModule } from './auth/jwt/jwt.module';
import { MongoModule } from './mongo/mongo.module';
import { LangChainModule } from './lang-chain/lang-chain.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    JwtModule,
    FileUploadModule,
    MongoModule,
    LangChainModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, LangChainService],
})
export class AppModule {}
