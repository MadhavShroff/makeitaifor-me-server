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
    console.log('userId @ getChatsMetadata', userId);
    const populatedUser = await this.chatsService.getChatsMetadata(userId);
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
    if (chatIds != null) return chatIds;
    else {
      const newChat = await this.chatsService.createNewChat();
      const newChats = await this.chatsService.addChatToUser(
        req.user.userId,
        newChat._id,
      );
      return newChats;
    }
  }

  // GET route to return a list of available models
  @Get('/getModels')
  @UseGuards(JwtAuthGuard)
  async getModels() {
    return [
      {
        color: 'orange-500',
        name: 'GPT-4',
      },
      {
        color: 'blue-500',
        name: 'GPT-3.5',
      },
      {
        image: 'https://avatars.githubusercontent.com/u/76263028?s=200&amp;v=4',
        name: 'Claude',
      },
      {
        image: 'https://avatars.githubusercontent.com/u/76263028?s=200&amp;v=4',
        name: 'Claude 2',
      },
    ];
  }
}
