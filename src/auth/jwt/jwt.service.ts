// jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../types/user';
import { JwtPayload } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  login(user: User) {
    const payload: JwtPayload = {
      username: user.email,
      name: user.name,
      id: user.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  generateWebSocketToken(user: User) {
    // Use only the necessary user data for the token
    const payload = { username: user.username, id: user.id };
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
      return payload; // if verification succeeds, it returns the payload
    } catch (error) {
      throw new Error('Invalid token'); // if verification fails, it throws an error
    }
  }
}
