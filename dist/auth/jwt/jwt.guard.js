"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt_service_1 = require("./jwt.service");
let JwtAuthGuard = exports.JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(jwtAuthService) {
        super();
        this.jwtAuthService = jwtAuthService;
    }
    async canActivate(context) {
        try {
            const superResult = await super.canActivate(context);
            if (superResult) {
                return true;
            }
        }
        catch (error) {
        }
        const request = context.switchToHttp().getRequest();
        try {
            const token = request.cookies['guest_token'];
            console.log('guest_token', token);
            const payload = this.jwtAuthService.verifyToken(token);
            console.log('payload', payload);
            if (payload.role === 'guest') {
                request.user = payload;
                return true;
            }
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token, authentication faile');
        }
        return false;
    }
};
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JwtAuthService])
], JwtAuthGuard);
//# sourceMappingURL=jwt.guard.js.map