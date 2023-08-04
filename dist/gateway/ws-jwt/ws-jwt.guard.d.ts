import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
export declare class WsJwtAuthGuard implements CanActivate {
    private jwtService;
    constructor(jwtService: JwtAuthService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
