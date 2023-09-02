import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtAuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket & { user } = context.switchToWs().getClient();

    if (process.env.APP_ENV !== 'production') {
      client.user = {
        id: '915b7cd5-08c1-45c2-9709-7585af332ee4',
        name: 'Madhav Shroff',
        username: 'libif87613@pixiil.com',
      };
      return true; // bypass the JWT check in development mode
    }

    const token = Array.isArray(client.handshake.query.token)
      ? client.handshake.query.token[0]
      : client.handshake.query.token;

    console.log('Token received at WSAuthGuard: ', token);
    try {
      const payload = this.jwtService.verifyToken(token);
      client.user = payload;
      return true;
    } catch (e) {
      throw new WsException('Unauthorized');
    }
  }
}
