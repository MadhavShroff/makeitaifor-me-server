import { NestMiddleware } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';

export class WsAuthenticationMiddleware implements NestMiddleware {
  constructor(private jwtAuthService: JwtAuthService) {} // Inject the JwtAuthService

  use(req: any, res: any, next: () => void) {
    const server: Server = req.app.get('io');
    server.use((socket: Socket, next) => {
      if (socket.handshake.query && socket.handshake.query.token) {
        const token = socket.handshake.query.token as string;
        try {
          this.jwtAuthService.verifyToken(token); // Use verifyToken method of JwtAuthService
          next();
        } catch (err) {
          next(new Error('Authentication error'));
        }
      } else {
        next(new Error('Authentication error'));
      }
    });
    next();
  }
}
