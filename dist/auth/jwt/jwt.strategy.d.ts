import { ConfigService } from '@nestjs/config';
export type JwtPayload = {
    name: string;
    username: string;
    id: string;
    role: string;
};
declare const JwtAuthStrategy_base: new (...args: any[]) => any;
export declare class JwtAuthStrategy extends JwtAuthStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        username: string;
        name: string;
    }>;
}
export {};
