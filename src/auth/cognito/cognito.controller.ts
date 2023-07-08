import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import JwtAuthService from '../jwt/jwt.service';
import { CognitoOauthGuard } from './cognito.guard';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../jwt/jwt.guard';

@Controller('auth/cognito')
export class CognitoController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private configService: ConfigService,
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

  @Get('redirect')
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
    return res.redirect('https://makeitaifor.me/');
  }
}
