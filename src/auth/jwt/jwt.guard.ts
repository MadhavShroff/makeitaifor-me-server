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

    console.log('Starting authentication process.');

    // Try normal JWT authentication first
    try {
      console.log('Trying normal JWT authentication.');
      const superResult = await super.canActivate(context);

      // If JWT authentication succeeds, proceed
      if (superResult) {
        console.log('Normal JWT authentication successful.');
        return true;
      } else {
        console.log('Normal JWT authentication failed.');
      }
    } catch (error) {
      console.log('Error during normal JWT authentication:', error);
    }

    // If JWT authentication fails, try guest token
    try {
      console.log('Trying guest JWT authentication.');
      const token = request.cookies['guest_token'];
      console.log('Guest token extracted:', token);

      // Validate the token using JwtAuthService
      const payload = this.jwtAuthService.verifyToken(token);
      console.log('Guest token payload:', payload);

      if (payload.role === 'guest') {
        console.log('Guest JWT authentication successful.');
        // Handle guest access
        request.user = payload;
        return true;
      } else {
        console.log("Guest JWT authentication failed. Role is not 'guest'.");
      }
    } catch (error) {
      console.log('Error during guest JWT authentication:', error);
      // Handle token validation error if needed
      throw new UnauthorizedException('Invalid token');
    }

    // If both methods fail, unauthorized
    console.log(
      'Both authentication methods failed. Throwing UnauthorizedException.',
    );
    return false;
  }
}
