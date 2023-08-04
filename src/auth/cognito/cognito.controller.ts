import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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
    return res.redirect('https://makeitaifor.me/chat');
  }

  @Post('logout')
  async logout(@Req() req, @Res() res) {
    const clientId = 'your-client-id'; // replace with your actual client ID
    const logoutUri = 'http://localhost:3000/'; // replace with your actual logout URI

    const status = await this.cognitoStrategy.logout(clientId, logoutUri);

    console.log('Logout status: ', status);

    if (status === 200) {
      res.clearCookie('SESSIONID'); // replace 'SESSIONID' with your cookie name
      return res.sendStatus(200);
    } else {
      return res.sendStatus(status);
    }
  }
}
