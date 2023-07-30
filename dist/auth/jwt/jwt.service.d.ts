import { JwtService } from '@nestjs/jwt';
import { User } from '../../types/user';
import { JwtPayload } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
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
