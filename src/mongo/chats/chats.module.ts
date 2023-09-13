import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Chat,
  ChatSchema,
  Message,
  MessageSchema,
  MessageVersion,
  MessageVersionSchema,
} from './chat.schema';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { User, UserSchema } from '../users/users.schema';
import { ChatsController } from './chats.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: MessageVersion.name, schema: MessageVersionSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersModule,
  ],
  providers: [ChatsService, ChatsResolver],
  exports: [ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}
