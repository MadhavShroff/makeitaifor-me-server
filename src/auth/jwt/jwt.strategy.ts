// jwt.strategy.ts
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type JwtPayload = { name: string; username: string; id: string };

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        console.log('req.cookies', req.cookies);
        token = req.cookies[configService.get<string>('SESSION_COOKIE_KEY')];
      }
      console.log(
        'token key:',
        configService.get<string>('SESSION_COOKIE_KEY'),
      );
      console.log('token', token);
      return token;
    };

    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: JwtPayload) {
    console.log('payload received at valiadte()', payload);
    return { id: payload.id, username: payload.username, name: payload.name };
  }
}
