import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthService } from '../jwt/jwt.service';
import { CognitoOauthGuard } from './cognito.guard';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { User } from 'src/mongo/users/users.schema';

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
    // Guard redirects to hosted aws cognito login page
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async cognitoAuthMe(@Req() req: Request) {
    console.log('at /me: req.user is ', req.user);
    return req.user;
  }

  @Get('/redirect')
  @UseGuards(CognitoOauthGuard)
  async cognitoAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = this.jwtAuthService.login({
      userId: req.user.userId,
      name: req.user.name,
      username: req.user.username,
      role: req.user.role,
      chats: [],
    } as User);
    res.clearCookie('guest_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
    res.cookie(
      this.configService.get<string>('SESSION_COOKIE_KEY'),
      accessToken,
      {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      },
    );
    if (process.env.APP_ENV === 'production')
      return res.redirect('https://makeitaifor.me/chat');
    else return res.redirect('http://localhost:3000/chat');
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

  // TODO: Callback route to handle when a new user signs up: Create a new empty chat for them
}
