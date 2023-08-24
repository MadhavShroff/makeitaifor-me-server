import { Controller, Get, UseGuards, Request, Res } from '@nestjs/common';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { JwtAuthService } from './jwt/jwt.service';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtAuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('ws-token')
  getWebSocketToken(@Request() req) {
    const token = this.jwtService.generateWebSocketToken(req.user);
    return { token };
  }
  @Get('guest')
  getGuestToken(@Res() res) {
    const accessToken = this.jwtService.createGuestToken();
    res.cookie('guest_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
    res.json({ success: true });
  }
}
