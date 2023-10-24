import { Controller, Get, UseGuards, Request, Res } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { JwtAuthService } from './jwt/jwt.service';
import { ChatsService } from 'src/mongo/chats/chats.service';
import { UsersService } from 'src/mongo/users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/mongo/users/users.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtAuthService,
    private chatsService: ChatsService,
    private usersService: UsersService,
  ) {}

  @Get('ws-token')
  @UseGuards(JwtAuthGuard)
  getWebSocketToken(@Request() req) {
    const token = this.jwtService.generateWebSocketToken({
      role: 'authenticated user',
      ...req.user,
    });
    return { token };
  }

  @Get('guest')
  async getGuestToken(@Res() res) {
    const newChat = await this.chatsService.createNewChat();
    const expiryDate = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now
    const userId: string = uuidv4();
    const user = await this.usersService.createWithExpiry(
      {
        userId: userId,
        name: 'Guest',
        role: 'guest',
        provider: 'server',
        email: `guest-${userId}@makeitaifor.me`,
        username: 'Guest',
        chats: [newChat._id],
      } as User,
      expiryDate,
    );
    console.log('Created guest user', user);
    const token = this.jwtService.generateWebSocketToken(user);
    res.cookie('guest_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
    res.json({ success: true });
  }
}
