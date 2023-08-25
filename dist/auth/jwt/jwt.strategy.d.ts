import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/types';
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
