import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/exchange')
  async exchangeCodeForUser(@Body('code') code: string) {
    return await this.authService.exchangeCodeForTokens(code);
  }
}
