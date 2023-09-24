import { Module } from '@nestjs/common';
import { FileUploadService } from './fileupload.service';
import { FileUploadController } from './fileupload.controller';
import { MongoModule } from 'src/mongo/mongo.module';
import { LangChainModule } from 'src/lang-chain/lang-chain.module';

@Module({
  imports: [MongoModule, LangChainModule],
  providers: [FileUploadService],
  controllers: [FileUploadController],
  exports: [FileUploadService],
})
export class FileUploadModule {}
