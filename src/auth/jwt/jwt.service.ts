// jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, User } from 'src/types';

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
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  generateWebSocketToken(user: User) {
    const payload: JwtPayload = {
      username: user.username,
      id: user.id,
      role: user.role,
      name: user.name,
    };
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
