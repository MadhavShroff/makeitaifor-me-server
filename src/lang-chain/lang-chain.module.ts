import { Module } from '@nestjs/common';
import { LangChainService } from './lang-chain.service';
import { MongoModule } from 'src/mongo/mongo.module';

@Module({
  imports: [MongoModule],
  providers: [LangChainService],
  exports: [LangChainService],
})
export class LangChainModule {}
