// src/mongo/chats/chats.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChatsService } from './chats.service';
import { Types } from 'mongoose';

@Resolver()
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService) {}

  @Mutation()
  async createChat(@Args('userId') userId: string): Promise<any> {
    return this.chatsService.createChat(userId);
  }

  // @Mutation()
  // async appendMessage(
  //   @Args('chatId') chatId: string,
  //   @Args('messageText') messageText: string,
  //   @Args('type') type: 'user' | 'ai',
  // ): Promise<any> {
  //   return this.chatsService.appendMessage(
  //     new Types.ObjectId(chatId),
  //     messageText,
  //     type,
  //   );
  // }

  // @Mutation()
  // async editMessage(
  //   @Args('chatId') chatId: string,
  //   @Args('messageId') messageId: string,
  //   @Args('newMessageText') newMessageText: string,
  //   @Args('type') type: 'user' | 'ai',
  // ): Promise<any> {
  //   return this.chatsService.editMessage(
  //     new Types.ObjectId(chatId),
  //     new Types.ObjectId(messageId),
  //     newMessageText,
  //     type,
  //   );
  // }

  // @Mutation()
  // async setActiveVersion(
  //   @Args('chatId') chatId: string,
  //   @Args('messageId') messageId: string,
  //   @Args('versionNumber') versionNumber: number,
  // ): Promise<any> {
  //   return this.chatsService.setActiveVersion(
  //     new Types.ObjectId(chatId),
  //     new Types.ObjectId(messageId),
  //     versionNumber,
  //   );
  // }

  // @Query()
  // async fetchActiveStream(@Args('chatId') chatId: string): Promise<any> {
  //   return this.chatsService.fetchActiveStream(new Types.ObjectId(chatId));
  // }
}
