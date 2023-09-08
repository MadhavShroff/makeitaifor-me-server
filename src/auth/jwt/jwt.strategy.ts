// jwt.strategy.ts
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/types';
import { UsersService } from 'src/mongo/users/users.service';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    const extractJwtFromCookie = (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies[configService.get<string>('SESSION_COOKIE_KEY')];
      }
      return token;
    };
    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne({ userId: payload.userId });
    console.log('user found at validate()', user);
    return user;
  }
}
