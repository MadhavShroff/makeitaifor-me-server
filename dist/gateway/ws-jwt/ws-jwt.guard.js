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
exports.WsJwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("../../auth/jwt/jwt.service");
const websockets_1 = require("@nestjs/websockets");
let WsJwtAuthGuard = exports.WsJwtAuthGuard = class WsJwtAuthGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    canActivate(context) {
        const client = context.switchToWs().getClient();
        if (process.env.APP_ENV !== 'production') {
            client.user = {
                id: '915b7cd5-08c1-45c2-9709-7585af332ee4',
                name: 'Madhav Shroff',
                username: 'libif87613@pixiil.com',
            };
            return true;
        }
        const token = Array.isArray(client.handshake.query.token)
            ? client.handshake.query.token[0]
            : client.handshake.query.token;
        console.log(token);
        try {
            const payload = this.jwtService.verifyToken(token);
            client.user = payload;
            return true;
        }
        catch (e) {
            throw new websockets_1.WsException('Unauthorized');
        }
    }
};
exports.WsJwtAuthGuard = WsJwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JwtAuthService])
], WsJwtAuthGuard);
//# sourceMappingURL=ws-jwt.guard.js.map