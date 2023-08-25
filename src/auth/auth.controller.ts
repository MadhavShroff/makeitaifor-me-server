import { Controller, Get, UseGuards, Request, Res } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { JwtAuthService } from './jwt/jwt.service';
import { GuestUser } from 'src/types';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtAuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('ws-token')
  getWebSocketToken(@Request() req) {
    const token = this.jwtService.generateWebSocketToken({
      role: 'authenticated user',
      ...req.user,
    });
    return { token };
  }
  @Get('guest')
  getGuestToken(@Res() res) {
    const token = this.jwtService.generateWebSocketToken(GuestUser);
    res.cookie('guest_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
    res.json({ success: true });
  }
}
