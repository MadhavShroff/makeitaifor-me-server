import { Request, Response } from 'express';
import { JwtAuthService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
export declare class CognitoController {
    private jwtAuthService;
    private configService;
    constructor(jwtAuthService: JwtAuthService, configService: ConfigService);
    cognitoAuth(_req: any): Promise<void>;
    cognitoAuthMe(req: Request): Promise<import("../../types/user").User>;
    cognitoAuthRedirect(req: Request, res: Response): Promise<void>;
}
