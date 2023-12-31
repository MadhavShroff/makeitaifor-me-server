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
exports.CognitoController = void 0;
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("../jwt/jwt.service");
const cognito_guard_1 = require("./cognito.guard");
const config_1 = require("@nestjs/config");
const jwt_guard_1 = require("../jwt/jwt.guard");
let CognitoController = exports.CognitoController = class CognitoController {
    constructor(jwtAuthService, configService) {
        this.jwtAuthService = jwtAuthService;
        this.configService = configService;
    }
    async cognitoAuth(_req) {
    }
    async cognitoAuthMe(req) {
        console.log('at /me: req.user is ', req.user);
        return req.user;
    }
    async cognitoAuthRedirect(req, res) {
        const { accessToken } = this.jwtAuthService.login({
            userId: req.user.userId,
            name: req.user.name,
            username: req.user.username,
            role: req.user.role,
            chats: [],
        });
        res.clearCookie('guest_token', {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
        });
        res.cookie(this.configService.get('SESSION_COOKIE_KEY'), accessToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        if (process.env.APP_ENV === 'production')
            return res.redirect('https://makeitaifor.me/chat');
        else
            return res.redirect('http://localhost:3000/chat');
    }
    async cognitoAuthLogoutRedirect(res) {
        res.clearCookie(this.configService.get('SESSION_COOKIE_KEY'), {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });
        res.clearCookie('guest_token', {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
        });
        return res.redirect('https://makeitaifor.me/');
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoOauthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "cognitoAuth", null);
__decorate([
    (0, common_1.Get)('/me'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "cognitoAuthMe", null);
__decorate([
    (0, common_1.Get)('/redirect'),
    (0, common_1.UseGuards)(cognito_guard_1.CognitoOauthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "cognitoAuthRedirect", null);
__decorate([
    (0, common_1.Get)('/logout-redirect'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CognitoController.prototype, "cognitoAuthLogoutRedirect", null);
exports.CognitoController = CognitoController = __decorate([
    (0, common_1.Controller)('auth/cognito'),
    __metadata("design:paramtypes", [jwt_service_1.JwtAuthService,
        config_1.ConfigService])
], CognitoController);
//# sourceMappingURL=cognito.controller.js.map