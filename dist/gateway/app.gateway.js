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
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_service_1 = require("../auth/jwt/jwt.service");
const lang_chain_service_1 = require("../lang-chain/lang-chain.service");
let AppGateway = exports.AppGateway = class AppGateway {
    constructor(langChainService, jwtService) {
        this.langChainService = langChainService;
        this.jwtService = jwtService;
    }
    afterInit(server) {
        console.log('Initialized Gateway!');
        this.server.use(async (socket, next) => {
            const token = socket.handshake.query.token;
            try {
                const payload = this.jwtService.verifyToken(token);
                socket.client.user = payload;
                next();
            }
            catch (err) {
                next(new Error('Authentication error'));
            }
        });
    }
    handleConnection(client, ...args) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    handleMessage(message) {
        console.log('Received message: ', message);
        return `Received at 'message', you sent: ${message}`;
    }
    buttonClicked(data) {
        console.log('Received event at buttonClicked with data: ', data);
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
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleDisconnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], AppGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('buttonClicked'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
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
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'https://www.makeitaifor.me',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [lang_chain_service_1.LangChainService,
        jwt_service_1.JwtAuthService])
], AppGateway);
//# sourceMappingURL=app.gateway.js.map