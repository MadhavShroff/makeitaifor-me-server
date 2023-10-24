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
    // Try normal JWT authentication first
    try {
      const superResult = await super.canActivate(context);
      // If JWT authentication succeeds, proceed
      if (superResult) {
        return true;
      }
    } catch (error) {
      // console.log('JWT auth failed:', error.message);
    }
    const request = context.switchToHttp().getRequest();
    // If JWT authentication fails, try guest token
    try {
      const token = request.cookies['guest_token'];
      console.log('guest_token : ', token);
      const payload = this.jwtAuthService.verifyToken(token);
      console.log('payload', payload);
      if (payload.role === 'guest') {
        console.log('guest token verified, returning true');
        request.user = payload;
        return true;
      }
    } catch (error) {
      console.log('guest token verification failed:', error.message);
      throw new UnauthorizedException('Invalid token, authentication faile');
    }
    return false;
  }
}
