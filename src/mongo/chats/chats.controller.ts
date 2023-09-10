// fileupload.controller.ts
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Get('/getChatsMetadata/:userId')
  @UseGuards(JwtAuthGuard)
  async getChatsMetadata(@Req() req, @Param('userId') userId: string) {
    const populatedUser = await this.chatsService.getChatsMetadata(userId);
    console.log(populatedUser);
    return populatedUser;
  }
}
