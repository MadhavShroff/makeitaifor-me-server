import { Controller, Get, UseGuards, Request, Res } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { JwtAuthService } from './jwt/jwt.service';
import { GuestUser } from 'src/types';
import { JwtGuestAuthGuard } from './jwt/jwt-guest.guard';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtAuthService) {}

  @Get('ws-token')
  @UseGuards(JwtAuthGuard)
  getWebSocketToken(@Request() req) {
    const token = this.jwtService.generateWebSocketToken({
      role: 'authenticated user',
      ...req.user,
    });
    console.log('Token generated at AuthController: ', token);
    return { token };
  }

  @Get('guest')
  @UseGuards(JwtGuestAuthGuard)
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
