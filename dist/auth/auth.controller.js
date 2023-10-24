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
const chats_service_1 = require("../mongo/chats/chats.service");
const users_service_1 = require("../mongo/users/users.service");
const uuid_1 = require("uuid");
let AuthController = exports.AuthController = class AuthController {
    constructor(jwtService, chatsService, usersService) {
        this.jwtService = jwtService;
        this.chatsService = chatsService;
        this.usersService = usersService;
    }
    getWebSocketToken(req) {
        const token = this.jwtService.generateWebSocketToken({
            role: 'authenticated user',
            ...req.user,
        });
        return { token };
    }
    async getGuestToken(res) {
        const newChat = await this.chatsService.createNewChat();
        const expiryDate = new Date(Date.now() + 12 * 60 * 60 * 1000);
        const userId = (0, uuid_1.v4)();
        const user = await this.usersService.createWithExpiry({
            userId: userId,
            name: 'Guest',
            role: 'guest',
            provider: 'server',
            email: `guest-${userId}@makeitaifor.me`,
            username: 'Guest',
            chats: [newChat._id],
        }, expiryDate);
        console.log('Created guest user', user);
        const token = this.jwtService.generateWebSocketToken(user);
        res.cookie('guest_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
        });
        res.json({ success: true });
    }
};
__decorate([
    (0, common_1.Get)('ws-token'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
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
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getGuestToken", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [jwt_service_1.JwtAuthService,
        chats_service_1.ChatsService,
        users_service_1.UsersService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map