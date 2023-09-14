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
    constructor(chatModel, userModel, messageModel, messageVersionModel) {
        this.chatModel = chatModel;
        this.userModel = userModel;
        this.messageModel = messageModel;
        this.messageVersionModel = messageVersionModel;
    }
    async createNewChat() {
        const newChat = new this.chatModel({
            title: 'New Chat',
            messages: [],
        });
        return await newChat.save();
    }
    async createChat(obj) {
        const newChat = new this.chatModel(obj == undefined
            ? {
                title: 'New Chat',
                messages: [],
            }
            : obj);
        return await newChat.save();
    }
    async createMessage(obj) {
        const newMessageVersion = new this.messageVersionModel(obj == undefined ? {} : obj);
        const mv = await newMessageVersion.save();
        console.log('New Message Version: ', mv);
        const newMessage = new this.messageModel({
            versions: [mv._id],
        });
        const res = await newMessage.save();
        console.log(res);
        res.populate('versions');
        return res;
    }
    async emptyChatExists(userId) {
        const user = await this.userModel
            .findOne({
            userId: userId,
            'chats.messages': { $exists: true, $size: 0 },
        })
            .exec();
        console.log('Chat found at emptyChatExists: ', JSON.stringify(user));
        if (user != null)
            return user.chats;
        else if (user === null)
            return null;
    }
    async addChatToUser(userId, chatId) {
        await this.userModel
            .findOne({ userId })
            .updateOne({ userId: userId, chats: { $ne: chatId } }, { $push: { chats: chatId } })
            .populate('chats')
            .exec()
            .then((user) => {
            console.log('User found at addChatToUser: ', JSON.stringify(user));
            return user;
        })
            .catch((err) => {
            console.log('Error at addChatToUser: ', err);
            return null;
        });
        return null;
    }
    async findChatByChatId(chatId) {
        const chat = await this.chatModel.findById(chatId).exec();
        if (!chat)
            return null;
        else
            return chat;
    }
    async appendMessageToChat(messageId, chatId) {
        const result = await this.chatModel.updateOne({ _id: chatId }, {
            $push: { messages: messageId },
            $set: { updatedAt: new Date(), title: 'New Chat' },
        });
        console.log(result);
        if (result.matchedCount === 0) {
            console.error(`Failed to find chat with ID ${chatId}`);
            throw new common_1.NotFoundException(`Chat with ID ${chatId} not found`);
        }
        if (result.modifiedCount === 0) {
            console.warn(`No documents were modified during the update operation for chat ID ${chatId}`);
        }
        return await this.findChatByChatId(chatId);
    }
    async getMessagesData(messages) {
        return this.messageModel
            .find({ _id: { $in: messages } })
            .populate('versions')
            .exec();
    }
    async getChatsMetadata(userId) {
        const user = await this.userModel
            .findOne({ userId })
            .populate('chats')
            .exec();
        console.log('User found at getChatsMetadata: ', JSON.stringify(user));
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
    }
};
exports.ChatsService = ChatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schema_1.Chat.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(chat_schema_1.Message.name)),
    __param(3, (0, mongoose_1.InjectModel)(chat_schema_1.MessageVersion.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ChatsService);
//# sourceMappingURL=chats.service.js.map