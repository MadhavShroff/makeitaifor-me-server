import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('/exchange')
  async exchangeCodeForUser(@Body('code') code: string) {
    // return await this.authService.exchangeCodeForTokens(code);
  }
}
