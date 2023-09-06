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
exports.ChatsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_schema_1 = require("./chat.schema");
const users_schema_1 = require("../users/users.schema");
let ChatsService = exports.ChatsService = class ChatsService {
    constructor(chatModel, userModel) {
        this.chatModel = chatModel;
        this.userModel = userModel;
    }
    async createTempChat() {
        const newChat = new this.chatModel({});
        return await newChat.save();
    }
    async createChat(obj) {
        const newChat = new this.chatModel({});
        return await newChat.save();
    }
    async addChatToUser(userId, chatId) {
        return null;
    }
    async findChatByChatId(chatId) {
        const chat = await this.chatModel.findById(chatId).exec();
        if (!chat)
            return null;
        else
            return chat;
    }
    async appendMessage(chatId, message) {
        const chat = await this.findChatByChatId(chatId);
        if (chat == null) {
            throw new common_1.NotFoundException(`Chat with ID ${chatId} not found`);
        }
        const newMessage = {
            versions: [message],
            previousMessage: null,
        };
        chat.messages.push(newMessage);
        chat.updatedAt = new Date();
        return await chat.save();
    }
};
exports.ChatsService = ChatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schema_1.Chat.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ChatsService);
//# sourceMappingURL=chats.service.js.map