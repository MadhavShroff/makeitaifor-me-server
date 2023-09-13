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
    let resultChats: Types.ObjectId[];
    if (this.chatsService.emptyChatExists(req.user.userId)) {
      resultChats = (await this.usersService.findUserByUserId(req.user.userId))
        .chats;
    } else {
      const newChat = await this.chatsService.createNewChat();
      resultChats = await this.chatsService.addChatToUser(
        req.user.userId,
        newChat._id,
      );
    }
    console.log('Result Chats: ', resultChats);
    return resultChats;
  }
}
