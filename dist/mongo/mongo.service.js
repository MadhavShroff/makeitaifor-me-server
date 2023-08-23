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
    constructor(generatedTextModel, processedTextModel) {
        this.generatedTextModel = generatedTextModel;
        this.processedTextModel = processedTextModel;
    }
    async saveGeneratedText(text, user) {
        const generatedText = new this.generatedTextModel({
            userId: user.id,
            text: text,
        });
        await generatedText.save();
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
    async getProcessedText(userId, fileId) {
        const processedText = await this.processedTextModel.findOne({
            userId: userId,
            Etag: fileId,
        });
        return processedText.text;
    }
};
exports.MongoService = MongoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('GeneratedText')),
    __param(1, (0, mongoose_1.InjectModel)('ProcessedText')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], MongoService);
//# sourceMappingURL=mongo.service.js.map