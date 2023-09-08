import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/types';
import { UsersService } from 'src/mongo/users/users.service';
declare const JwtAuthStrategy_base: new (...args: any[]) => any;
export declare class JwtAuthStrategy extends JwtAuthStrategy_base {
    private usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(payload: JwtPayload): Promise<import("../../mongo/users/users.schema").User>;
}
export {};
