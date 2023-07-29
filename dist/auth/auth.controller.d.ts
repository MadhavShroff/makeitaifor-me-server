import { JwtAuthService } from './jwt/jwt.service';
export declare class AuthController {
    private jwtService;
    constructor(jwtService: JwtAuthService);
    getWebSocketToken(req: any): {
        token: string;
    };
}
