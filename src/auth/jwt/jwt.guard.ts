import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthService } from './jwt.service'; // Adjust the import path

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtAuthService: JwtAuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Try normal JWT authentication first
    try {
      console.log('JWT Token:', request.cookies);
      const superResult = await super.canActivate(context);
      // If JWT authentication succeeds, proceed
      if (superResult) {
        return true;
      }
    } catch (error) {
      console.log('JWT auth failed:', error.message, error);
    }

    // If JWT authentication fails, try guest token
    try {
      const token = request.cookies['guest_token'];
      const payload = this.jwtAuthService.verifyToken(token);
      if (payload.role === 'guest') {
        request.user = payload;
        return true;
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
    return false;
  }
}
