import { Request, Response } from 'express';
import { JwtAuthService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { CognitoStrategy } from './cognito.strategy';
export declare class CognitoController {
    private jwtAuthService;
    private configService;
    private cognitoStrategy;
    constructor(jwtAuthService: JwtAuthService, configService: ConfigService, cognitoStrategy: CognitoStrategy);
    cognitoAuth(_req: any): Promise<void>;
    cognitoAuthMe(req: Request): Promise<import("../../types/user").User>;
    cognitoAuthRedirect(req: Request, res: Response): Promise<void>;
    cognitoAuthLogoutRedirect(res: Response): Promise<void>;
}
