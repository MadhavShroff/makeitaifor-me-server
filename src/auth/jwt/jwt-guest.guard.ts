// jwt.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthService } from './jwt.service'; // Adjust the import path
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtGuestAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtAuthService: JwtAuthService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Extract token from the cookie
    const token = request.cookies['guest_token'];

    try {
      // Validate the token using JwtAuthService
      const payload = this.jwtAuthService.verifyToken(token);
      if (payload.role === 'guest') {
        // Handle guest access
        request.user = payload;
        return true;
      }
    } catch (error) {
      // Handle token validation error if needed
      throw new UnauthorizedException('Invalid token');
    }

    // Continue normal authentication for non-guest users
    return super.canActivate(context);
  }
}
