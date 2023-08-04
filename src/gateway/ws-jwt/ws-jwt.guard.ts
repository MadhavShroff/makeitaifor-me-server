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
    const token = Array.isArray(client.handshake.query.token)
      ? client.handshake.query.token[0]
      : client.handshake.query.token;
    try {
      const payload = this.jwtService.verifyToken(token);
      client.user = payload;
      return true;
    } catch (e) {
      throw new WsException('Unauthorized');
    }
  }
}
