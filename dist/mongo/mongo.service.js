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
exports.MongoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MongoService = exports.MongoService = class MongoService {
    constructor(generatedTextModel, processedTextModel, messageVersionModel, chatModel) {
        this.generatedTextModel = generatedTextModel;
        this.processedTextModel = processedTextModel;
        this.messageVersionModel = messageVersionModel;
        this.chatModel = chatModel;
    }
    async saveGeneratedText(text, versionId) {
        const result = await this.messageVersionModel.updateOne({ _id: versionId }, { $set: { text: text, updatedAt: new Date() } });
        if (result.matchedCount === 0) {
            console.error(`Failed to find message version with ID ${versionId}`);
            throw new common_1.NotFoundException(`Chat with ID ${versionId} not found`);
        }
        if (result.modifiedCount === 0) {
            console.warn(`No documents were modified during the update operation for chat ID ${versionId}`);
        }
    }
    async saveGeneratedTitle(newTitle, chatId) {
        const result = await this.chatModel.findOneAndUpdate({ _id: chatId }, { $set: { title: newTitle, updatedAt: new Date() } }, { new: true });
        if (result.matchedCount === 0) {
            console.error(`Failed to find chat with ID ${chatId}`);
            throw new common_1.NotFoundException(`Chat with ID ${chatId} not found`);
        }
        if (result.modifiedCount === 0) {
            console.warn(`No documents were modified during the update operation for chat ID ${chatId}`);
        }
    }
    async saveProcessedText(userId, fileId, text) {
        const generatedText = new this.processedTextModel({
            userId: userId,
            text: text,
            Etag: fileId,
            timestamp: new Date(),
        });
        await generatedText.save();
    }
    async getProcessedText(userId, ETag) {
        const processedText = await this.processedTextModel.findOne({
            userId: userId,
            Etag: ETag,
        });
        console.log('Processed Text: ', processedText);
        return processedText.text;
    }
};
exports.MongoService = MongoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('GeneratedText')),
    __param(1, (0, mongoose_1.InjectModel)('ProcessedText')),
    __param(2, (0, mongoose_1.InjectModel)('MessageVersion')),
    __param(3, (0, mongoose_1.InjectModel)('Chat')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], MongoService);
//# sourceMappingURL=mongo.service.js.map