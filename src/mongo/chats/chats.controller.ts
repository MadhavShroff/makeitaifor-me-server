// fileupload.controller.ts
import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ChatsService } from './chats.service';
import { Types } from 'mongoose';
import { UsersService } from '../users/users.service';

@Controller('chats')
export class ChatsController {
  constructor(
    private chatsService: ChatsService,
    private usersService: UsersService,
  ) {}

  // TODO: Remove param userId, instead use req.user
  @Get('/getChatsMetadata/:userId')
  @UseGuards(JwtAuthGuard)
  async getChatsMetadata(@Req() req, @Param('userId') userId: string) {
    const populatedUser = await this.chatsService.getChatsMetadata(userId);
    console.log(populatedUser);
    return populatedUser;
  }

  // TODO: Remove param userId, instead use req.user
  @Post('/getMessagesData')
  @UseGuards(JwtAuthGuard)
  async getMessagesData(@Req() req) {
    const messagesData = await this.chatsService.getMessagesData(
      req.body.messageIds,
    );
    return messagesData;
  }

  // TODO: Remove param userId, instead use req.user
  @Post('/createNewChat')
  @UseGuards(JwtAuthGuard)
  async createNewChat(@Req() req): Promise<Types.ObjectId[]> {
    const chatIds = await this.chatsService.emptyChatExists(req.user.userId);
    console.log('Chat Ids: ', chatIds);
    if (chatIds != null) return chatIds;
    else {
      const newChat = await this.chatsService.createNewChat();
      const newChats = await this.chatsService.addChatToUser(
        req.user.userId,
        newChat._id,
      );
      console.log('Returning Updated Chats: ', newChats);
      return newChats;
    }
  }
}
