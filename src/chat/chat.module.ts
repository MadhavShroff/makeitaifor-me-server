import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { FileUploadModule } from '../fileupload/fileupload.module';
import { MongoModule } from '../mongo/mongo.module';

@Module({
  controllers: [ChatController],
  imports: [FileUploadModule, MongoModule],
})
export class ChatModule {}
