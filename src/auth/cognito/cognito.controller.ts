import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthService } from '../jwt/jwt.service';
import { CognitoOauthGuard } from './cognito.guard';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { CognitoStrategy } from './cognito.strategy';

@Controller('auth/cognito')
export class CognitoController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private configService: ConfigService,
    private cognitoStrategy: CognitoStrategy,
  ) {}

  @Get()
  @UseGuards(CognitoOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async cognitoAuth(@Req() _req) {
    // Guard redirects
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async cognitoAuthMe(@Req() req: Request) {
    return req.user;
  }

  @Get('/redirect')
  @UseGuards(CognitoOauthGuard)
  async cognitoAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = this.jwtAuthService.login(req.user);
    res.cookie(
      this.configService.get<string>('SESSION_COOKIE_KEY'),
      accessToken,
      {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
    );
    if (this.configService.get<string>('ENV') === 'dev')
      return res.redirect('http://localhost:3000/chat');
    else return res.redirect('https://makeitaifor.me/chat'); // Redirects to /chat on successful cognito login
  }

  @Get('/logout-redirect')
  async cognitoAuthLogoutRedirect(@Res() res: Response) {
    res.clearCookie(this.configService.get<string>('SESSION_COOKIE_KEY'), {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.clearCookie('guest_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
    return res.redirect('https://makeitaifor.me/'); // Redirects to /chat on successful cognito logout
  }
}
