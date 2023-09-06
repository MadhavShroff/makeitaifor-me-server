// fileupload.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { MongoService } from 'src/mongo/mongo.service';
import { ChatsService } from './chats.service';

@Controller('mongo')
export class MongoController {
  constructor(
    private mongoService: MongoService,
    private chatsService: ChatsService,
  ) {}

  @Get('getChatsMetadata')
  @UseGuards(JwtAuthGuard)
  async getChatsMetadata(@Req() req) {
    const populatedUser = await this.chatsService.getChatsMetadata(req.user.id);
    console.log(populatedUser);
    return populatedUser;
  }
}
