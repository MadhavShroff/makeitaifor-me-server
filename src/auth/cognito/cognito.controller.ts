import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import JwtAuthService from '../jwt/jwt.service';
import { CognitoOauthGuard } from './cognito.guard';
import { ConfigService } from '@nestjs/config';
// import { JwtAuthGuard } from '../jwt/jwt.guard';

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
  async cognitoAuthMe(@Req() req: Request) {
    console.log('Received token:', req.headers); // log the received token
    console.log('User payload:', req.user); // log the user payload
    console.log('req.cookies', req.cookies || 'no cookies available');
    return req.user;
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
        sameSite: 'none',
        secure: true,
      },
    );
    console.log('cookie set:', accessToken);
    return res.redirect('https://makeitaifor.me/');
  }
}
