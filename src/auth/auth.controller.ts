import { Controller, Get, UseGuards, Request } from '@nestjs/common';
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
}
