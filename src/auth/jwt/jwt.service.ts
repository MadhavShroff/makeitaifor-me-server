// jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/types';
import { User } from '../../mongo/users/users.schema';

@Injectable()
export class JwtAuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  login(user: User) {
    console.log('user at login: ', user);
    const payload: JwtPayload = {
      username: user.username,
      name: user.name,
      userId: user.userId,
      role: user.role,
    };
    console.log('payload being signed:', payload);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  generateWebSocketToken(user: User) {
    console.log('user at generateWebSocketToken: ', user);
    const payload: JwtPayload = {
      username: user.username,
      userId: user.userId,
      role: user.role,
      name: user.name,
    };
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string) {
    console.log('token at verifyToken:', token);
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
      console.log('payload got post verificatation: ', payload);
      return payload; // if verification succeeds, it returns the payload
    } catch (error) {
      console.log('error', error);
      throw new Error('Invalid token'); // if verification fails, it throws an error
    }
  }
}
