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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fileupload_service_1 = require("../fileupload/fileupload.service");
const mongo_service_1 = require("../mongo/mongo.service");
let ChatController = exports.ChatController = class ChatController {
    constructor(fileUploadService, mongoService, configService) {
        this.fileUploadService = fileUploadService;
        this.mongoService = mongoService;
        this.configService = configService;
    }
    async getDocumentContent(fileId, userId, req) {
        try {
            const text = await this.mongoService.getProcessedText(userId, fileId);
            if (!text) {
                throw new common_1.HttpException('File not found', common_1.HttpStatus.NOT_FOUND);
            }
            return text;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
__decorate([
    (0, common_1.Get)('/getDocumentContent'),
    __param(0, (0, common_1.Query)('fileId')),
    __param(1, (0, common_1.Query)('userId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getDocumentContent", null);
exports.ChatController = ChatController = __decorate([
    (0, common_1.Controller)('chats'),
    __metadata("design:paramtypes", [fileupload_service_1.FileUploadService,
        mongo_service_1.MongoService,
        config_1.ConfigService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map