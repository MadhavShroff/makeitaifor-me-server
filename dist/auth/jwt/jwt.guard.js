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
        const request = context.switchToHttp().getRequest();
        console.log('Starting authentication process.');
        try {
            console.log('Trying normal JWT authentication.');
            const superResult = await super.canActivate(context);
            if (superResult) {
                console.log('Normal JWT authentication successful.');
                return true;
            }
            else {
                console.log('Normal JWT authentication failed.');
            }
        }
        catch (error) {
            console.log('Error during normal JWT authentication:', error);
        }
        try {
            console.log('Trying guest JWT authentication.');
            const token = request.cookies['guest_token'];
            console.log('Guest token extracted:', token);
            const payload = this.jwtAuthService.verifyToken(token);
            console.log('Guest token payload:', payload);
            if (payload.role === 'guest') {
                console.log('Guest JWT authentication successful.');
                request.user = payload;
                return true;
            }
            else {
                console.log("Guest JWT authentication failed. Role is not 'guest'.");
            }
        }
        catch (error) {
            console.log('Error during guest JWT authentication:', error);
            throw new common_1.UnauthorizedException('Invalid token');
        }
        console.log('Both authentication methods failed. Throwing UnauthorizedException.');
        return false;
    }
};
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JwtAuthService])
], JwtAuthGuard);
//# sourceMappingURL=jwt.guard.js.map