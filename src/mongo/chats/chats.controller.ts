// fileupload.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Get('getChatsMetadata')
  @UseGuards(JwtAuthGuard)
  async getChatsMetadata(@Req() req) {
    const populatedUser = await this.chatsService.getChatsMetadata(req.user.id);
    console.log(populatedUser);
    return populatedUser;
  }
}
