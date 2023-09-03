import { ExecutionContext } from '@nestjs/common';
import { JwtAuthService } from './jwt.service';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private jwtAuthService;
    constructor(jwtAuthService: JwtAuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
