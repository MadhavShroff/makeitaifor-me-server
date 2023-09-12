// fileupload.controller.ts
import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

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
    console.log('CSRF Token Header:', req.headers['csrf-token']);
    console.log('CSRF Cookie:', req.cookies._csrf);
    const messagesData = await this.chatsService.getMessagesData(
      req.body.messages,
    );
    console.log(messagesData);
    return messagesData;
  }
}
