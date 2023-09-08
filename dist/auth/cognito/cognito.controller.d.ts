import { Request, Response } from 'express';
import { JwtAuthService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/mongo/users/users.schema';
export declare class CognitoController {
    private jwtAuthService;
    private configService;
    constructor(jwtAuthService: JwtAuthService, configService: ConfigService);
    cognitoAuth(_req: any): Promise<void>;
    cognitoAuthMe(req: Request): Promise<User>;
    cognitoAuthRedirect(req: Request, res: Response): Promise<void>;
    cognitoAuthLogoutRedirect(res: Response): Promise<void>;
}
