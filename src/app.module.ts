// app.module.ts
import { Global, Module } from '@nestjs/common';
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
import * as dotenv from 'dotenv';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        async () => {
          dotenv.config({ path: '.env' });
          return process.env;
        },
      ],
    }),
    JwtModule,
    AuthModule,
    UsersModule,
    FileUploadModule,
    MongoModule,
    LangChainModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, LangChainService],
})
export class AppModule {}

// SmartGPT is a model agnostic parameterized and highly flexible system that can be applied to disparate use cases.
// We are already working on applications in a number of domains in both the public and private sectors.
// The system is evolving and improving constantly under the hood, as we continue to innovate.
// While the current system can get state of the art results, With the ability to handle enterprise scale data, there are a number of known ways to improve it which we aim to implement
// in the near future, from better, more numerous automatically sourced exemplars to LLM driven prompt optimization, to find tuning just getting started with SmartGPT and we are uniquely positioned
// as a tiny team to integrate both our own ongoing improvements as well as promising discoveries in the field as they arise.
