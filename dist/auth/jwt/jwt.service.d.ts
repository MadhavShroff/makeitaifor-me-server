import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, User } from 'src/types';
export declare class JwtAuthService {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    login(user: User): {
        accessToken: string;
    };
    generateWebSocketToken(user: User): string;
    verifyToken(token: string): JwtPayload;
}
