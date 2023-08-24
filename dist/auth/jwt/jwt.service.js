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
exports.JwtAuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let JwtAuthService = exports.JwtAuthService = class JwtAuthService {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    login(user) {
        const payload = {
            username: user.email,
            name: user.name,
            id: user.id,
            role: user.role,
        };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
    generateWebSocketToken(user) {
        const payload = { username: user.username, id: user.id };
        return this.jwtService.sign(payload);
    }
    createGuestToken() {
        const guestPayload = { role: 'guest' };
        return this.jwtService.sign(guestPayload);
    }
    verifyToken(token) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET_KEY'),
            });
            return payload;
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
};
exports.JwtAuthService = JwtAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], JwtAuthService);
//# sourceMappingURL=jwt.service.js.map