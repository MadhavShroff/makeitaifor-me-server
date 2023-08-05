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
const socket_io_1 = require("socket.io");
const jwt_service_1 = require("../auth/jwt/jwt.service");
const ws_jwt_guard_1 = require("./ws-jwt/ws-jwt.guard");
const lang_chain_service_1 = require("../lang-chain/lang-chain.service");
let AppGateway = exports.AppGateway = class AppGateway {
    constructor(langChainService, jwtService, configService) {
        this.langChainService = langChainService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    afterInit() {
        console.log('Initialized Gateway!');
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.user} + ${JSON.stringify(client.handshake.query)}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    handleMessage(message, client) {
        console.log('Received message: ', message);
        console.log('User: ', client.user);
        return `Received at 'message', you sent: ${message}`;
    }
    buttonClicked(data, client) {
        console.log('Received event at buttonClicked with data: ', data);
        console.log('User: ', client.user);
        return 'Acknowledged button click! : ' + data;
    }
    async generateText(data, client) {
        console.log('Received event at tryButtonClicked with data: ', data);
        const result = await this.langChainService.generateText(data.content, client.user);
        return { event: 'textGenerated', data: result };
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
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", String)
], AppGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('buttonClicked'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", String)
], AppGateway.prototype, "buttonClicked", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('tryButtonClicked'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "generateText", null);
exports.AppGateway = AppGateway = __decorate([
    (0, common_1.UseGuards)(ws_jwt_guard_1.WsJwtAuthGuard),
    (0, websockets_1.WebSocketGateway)({
        cors: new config_1.ConfigService().get('ENV') === 'dev'
            ? {
                origin: ['https://www.makeitaifor.me'],
                methods: ['GET', 'POST'],
                credentials: true,
            }
            : {
                origin: ['http://localhost:3000'],
                methods: ['GET', 'POST'],
            },
    }),
    __metadata("design:paramtypes", [lang_chain_service_1.LangChainService,
        jwt_service_1.JwtAuthService,
        config_1.ConfigService])
], AppGateway);
//# sourceMappingURL=app.gateway.js.map