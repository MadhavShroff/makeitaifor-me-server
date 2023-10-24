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
    const payload: JwtPayload = {
      username: user.username,
      name: user.name,
      userId: user.userId,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  generateWebSocketToken(user: User) {
    const payload: JwtPayload = {
      username: user.username,
      userId: user.userId,
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
      throw new Error('Invalid JWT Token at jwt.service.ts > verifyToken'); // if verification fails, it throws an error
    }
  }
}
