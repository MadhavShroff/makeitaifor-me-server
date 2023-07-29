import { JwtService } from '@nestjs/jwt';
import { User } from '../../types/user';
export declare class JwtAuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    login(user: User): {
        accessToken: string;
    };
    generateWebSocketToken(user: User): string;
}
