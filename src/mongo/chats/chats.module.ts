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
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { User, UserSchema } from '../users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: MessageVersion.name, schema: MessageVersionSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [ChatsService, ChatsResolver],
  exports: [ChatsService],
})
export class ChatsModule {}
