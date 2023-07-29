// jwt.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../types/user';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

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
}
