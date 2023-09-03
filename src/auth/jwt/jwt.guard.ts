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
    const superResult = await super.canActivate(context);

    // If JWT authentication succeeds, proceed
    if (superResult) {
      return true;
    }

    // If JWT authentication fails, try guest token
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

    // If both methods fail, unauthorized
    return false;
  }
}
