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
exports.LangChainGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let LangChainGateway = exports.LangChainGateway = class LangChainGateway {
    handleMessage(client, payload) {
        console.log('received event at message with data: ', payload);
        return `Received your message: ${payload}`;
    }
    buttonClicked(client, payload) {
        console.log('received event at buttonClicked with data: ', payload);
        return 'Acknowledged button click!';
    }
    handleConnection(client, ...args) {
        console.log(`Client connected: ${client.id}`);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], LangChainGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", String)
], LangChainGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('buttonClicked'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", String)
], LangChainGateway.prototype, "buttonClicked", null);
exports.LangChainGateway = LangChainGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/socket.io',
        cors: {
            origin: 'https://www.makeitaifor.me',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    })
], LangChainGateway);
//# sourceMappingURL=lang-chain.gateway.js.map