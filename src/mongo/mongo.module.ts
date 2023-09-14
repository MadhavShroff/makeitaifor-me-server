import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GeneratedTextSchema } from './generated-text.schema';
import { ProcessedTextSchema } from './processed-text.schema';
import { ConfigService } from '@nestjs/config';
import { MongoService } from './mongo.service';
import { ChatSchema, MessageVersionSchema } from './chats/chat.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'GeneratedText', schema: GeneratedTextSchema },
      { name: 'ProcessedText', schema: ProcessedTextSchema },
      { name: 'MessageVersion', schema: MessageVersionSchema },
      { name: 'Chat', schema: ChatSchema },
    ]),
  ],
  providers: [MongoService],
  exports: [MongoService, MongooseModule],
})
export class MongoModule {}
