import { JwtAuthService } from './jwt.service';
import { ExecutionContext } from '@nestjs/common';
declare const JwtGuestAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtGuestAuthGuard extends JwtGuestAuthGuard_base {
    private jwtAuthService;
    constructor(jwtAuthService: JwtAuthService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
}
export {};
