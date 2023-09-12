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
exports.ChatsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../../auth/jwt/jwt.guard");
const chats_service_1 = require("./chats.service");
let ChatsController = exports.ChatsController = class ChatsController {
    constructor(chatsService) {
        this.chatsService = chatsService;
    }
    async getChatsMetadata(req, userId) {
        const populatedUser = await this.chatsService.getChatsMetadata(userId);
        console.log(populatedUser);
        return populatedUser;
    }
    async getMessagesData(req) {
        const messagesData = await this.chatsService.getMessagesData(req.body.messageIds);
        return messagesData;
    }
    async createNewChat(req) {
        const newChat = await this.chatsService.createNewChat();
        const chats = await this.chatsService.addChatToUser(req.user.userId, newChat._id);
        console.log(chats);
        console.log(newChat);
        return chats;
    }
};
__decorate([
    (0, common_1.Get)('/getChatsMetadata/:userId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "getChatsMetadata", null);
__decorate([
    (0, common_1.Post)('/getMessagesData'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "getMessagesData", null);
__decorate([
    (0, common_1.Post)('/createNewChat'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatsController.prototype, "createNewChat", null);
exports.ChatsController = ChatsController = __decorate([
    (0, common_1.Controller)('chats'),
    __metadata("design:paramtypes", [chats_service_1.ChatsService])
], ChatsController);
//# sourceMappingURL=chats.controller.js.map