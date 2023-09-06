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
exports.MongoController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../../auth/jwt/jwt.guard");
const mongo_service_1 = require("../mongo.service");
const chats_service_1 = require("./chats.service");
let MongoController = exports.MongoController = class MongoController {
    constructor(mongoService, chatsService) {
        this.mongoService = mongoService;
        this.chatsService = chatsService;
    }
    async getChatsMetadata(req) {
        const populatedUser = await this.chatsService.getChatsMetadata(req.user.id);
        console.log(populatedUser);
        return populatedUser;
    }
};
__decorate([
    (0, common_1.Get)('getChatsMetadata'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MongoController.prototype, "getChatsMetadata", null);
exports.MongoController = MongoController = __decorate([
    (0, common_1.Controller)('mongo'),
    __metadata("design:paramtypes", [mongo_service_1.MongoService,
        chats_service_1.ChatsService])
], MongoController);
//# sourceMappingURL=chats.controller.js.map