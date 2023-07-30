import { NestMiddleware } from '@nestjs/common';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
export declare class WsAuthenticationMiddleware implements NestMiddleware {
    private jwtAuthService;
    constructor(jwtAuthService: JwtAuthService);
    use(req: any, res: any, next: () => void): void;
}
