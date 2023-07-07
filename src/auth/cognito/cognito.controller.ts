import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import JwtAuthService from '../jwt/jwt.service';
import { CognitoOauthGuard } from './cognito.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth/cognito')
export class CognitoController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(CognitoOauthGuard)
  async cognitoAuth(@Req() _req) {
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(CognitoOauthGuard)
  async cognitoAuthRedirect(@Req() req: Request, @Res() res: Response) {
    console.log('req.user', req.user);
    const { accessToken } = this.jwtAuthService.login(req.user);
    console.log('accessToken', accessToken);
    res.cookie(
      this.configService.get<string>('SESSION_COOKIE_KEY'),
      accessToken,
      {
        httpOnly: true,
        sameSite: 'lax',
      },
    );
    console.log('cookie set:', accessToken);
    return res.redirect('https://makeitaifor.me/');
  }
}
