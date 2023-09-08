import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../mongo/users/users.service';
import { ChatsService } from 'src/mongo/chats/chats.service';
import { User } from 'src/mongo/users/users.schema';
declare const CognitoStrategy_base: new (...args: any[]) => any;
export declare class CognitoStrategy extends CognitoStrategy_base {
    private readonly usersService;
    private readonly chatsService;
    private domain;
    private region;
    private clientId;
    constructor(configService: ConfigService, usersService: UsersService, chatsService: ChatsService);
    static baseUrl(domain: string, region: string): string;
    static authorizationUrl(domain: string, region: string): string;
    static tokenUrl(domain: string, region: string): string;
    static userInfoUrl(domain: string, region: string): string;
    validate(accessToken: string): Promise<User>;
}
export {};
