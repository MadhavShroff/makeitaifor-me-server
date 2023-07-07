import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../types/user';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export default class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login(user: User) {
    const payload: JwtPayload = { username: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
