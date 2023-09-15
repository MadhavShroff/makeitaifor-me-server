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
exports.AppGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const websockets_1 = require("@nestjs/websockets");
const mongoose_1 = require("mongoose");
const socket_io_1 = require("socket.io");
const jwt_service_1 = require("../auth/jwt/jwt.service");
const ws_jwt_guard_1 = require("./ws-jwt/ws-jwt.guard");
const lang_chain_service_1 = require("../lang-chain/lang-chain.service");
const chats_service_1 = require("../mongo/chats/chats.service");
const opts = {
    cors: process.env.APP_ENV === 'production'
        ? {
            origin: ['https://www.makeitaifor.me'],
            methods: ['GET', 'POST'],
            credentials: true,
        }
        : {
            origin: ['http://localhost:3001'],
            methods: ['GET', 'POST'],
        },
};
let AppGateway = exports.AppGateway = class AppGateway {
    constructor(langChainService, jwtService, configService, chatsService) {
        this.langChainService = langChainService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.chatsService = chatsService;
    }
    afterInit() {
    }
    handleConnection(client) {
    }
    handleDisconnect(client) {
    }
    async generateText(data, client) {
        console.log('Received event at generateText with data: ', data);
        const previousConversation = await this.chatsService.getActiveMessages(data.chatId);
        const fullGeneratedText = await this.langChainService.generateText(data.query, client.user, data.versionId, previousConversation, (str, seq) => {
            client.emit('textGeneratedChunk-' + data.chatId, {
                event: 'textGeneratedChunk',
                data: str,
                seq: seq,
            });
        });
        if (this.chatsService.isDefaultTitleForChat(data.chatId)) {
            console.log('Chat does not have a title. Generating one...');
            await this.langChainService.setTitle(data.query, fullGeneratedText, data.chatId, (str) => {
                client.emit('titleGenerated-' + data.chatId, {
                    event: 'titleGenerated',
                    title: str,
                });
            });
        }
        return { event: 'textGenerated-' + data.chatId, data: fullGeneratedText };
    }
    async messageSubmitted(data, client) {
        if (data.chatId === '123') {
            client.emit('addedQueryToChat-' + data.chatId, JSON.stringify({
                event: 'addedQueryAndResponseToChat-' + data.chatId,
                message: {
                    versions: [
                        {
                            text: data.content,
                            type: 'user',
                            isActive: true,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            versionNumber: 1,
                            _id: 123,
                            __v: 0,
                        },
                    ],
                    _id: 'abc',
                    __v: 0,
                },
            }));
            client.emit('addedResponseToChat-' + data.chatId, JSON.stringify({
                event: 'addedQueryAndResponseToChat-' + data.chatId,
                message: {
                    versions: [
                        {
                            text: ' ',
                            type: 'ai',
                            isActive: true,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            versionNumber: 1,
                            _id: 234,
                            __v: 0,
                        },
                    ],
                    _id: 'def',
                    __v: 0,
                },
            }));
            return;
        }
        const newQueryMessage = await this.chatsService.createMessage({
            text: data.content,
            type: 'user',
            isActive: true,
            versionNumber: 1,
        });
        const newResponseMessage = await this.chatsService.createMessage({
            text: ' ',
            type: 'ai',
            isActive: true,
            versionNumber: 1,
        });
        await Promise.all([
            this.chatsService.appendMessageToChat(newQueryMessage._id, new mongoose_1.Types.ObjectId(data.chatId)),
            this.chatsService.appendMessageToChat(newResponseMessage._id, new mongoose_1.Types.ObjectId(data.chatId)),
        ]).then(() => {
            client.emit('addedQueryToChat-' + data.chatId, JSON.stringify({
                event: 'addedQueryAndResponseToChat-' + data.chatId,
                message: newQueryMessage.$clone(),
            }));
            client.emit('addedResponseToChat-' + data.chatId, JSON.stringify({
                event: 'addedQueryAndResponseToChat-' + data.chatId,
                message: newResponseMessage.$clone(),
            }));
        });
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AppGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('generateText'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "generateText", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('messageSubmitted'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "messageSubmitted", null);
exports.AppGateway = AppGateway = __decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtAuthGuard),
    (0, websockets_1.WebSocketGateway)(opts),
    __metadata("design:paramtypes", [lang_chain_service_1.LangChainService,
        jwt_service_1.JwtAuthService,
        config_1.ConfigService,
        chats_service_1.ChatsService])
], AppGateway);
//# sourceMappingURL=app.gateway.js.map