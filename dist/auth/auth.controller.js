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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("./jwt/jwt.guard");
const jwt_service_1 = require("./jwt/jwt.service");
const types_1 = require("../types");
let AuthController = exports.AuthController = class AuthController {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    getWebSocketToken(req) {
        const token = this.jwtService.generateWebSocketToken({
            role: 'authenticated user',
            ...req.user,
        });
        return { token };
    }
    getGuestToken(res) {
        const token = this.jwtService.generateWebSocketToken(types_1.GuestUser);
        res.cookie('guest_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
        });
        res.json({ success: true });
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)('ws-token'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getWebSocketToken", null);
__decorate([
    (0, common_1.Get)('guest'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getGuestToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [jwt_service_1.JwtAuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map