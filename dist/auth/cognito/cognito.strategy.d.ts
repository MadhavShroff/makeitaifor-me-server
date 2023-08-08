import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
declare const CognitoStrategy_base: new (...args: any[]) => any;
export declare class CognitoStrategy extends CognitoStrategy_base {
    private readonly usersService;
    private domain;
    private region;
    private clientId;
    constructor(configService: ConfigService, usersService: UsersService);
    static baseUrl(domain: string, region: string): string;
    static authorizationUrl(domain: string, region: string): string;
    static tokenUrl(domain: string, region: string): string;
    static userInfoUrl(domain: string, region: string): string;
    validate(accessToken: string): Promise<import("../../users/users.schema").User>;
}
export {};
