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
exports.LangChainService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("langchain/chat_models/openai");
const schema_1 = require("langchain/schema");
const mongo_service_1 = require("../mongo/mongo.service");
let LangChainService = exports.LangChainService = class LangChainService {
    constructor(mongoService) {
        this.mongoService = mongoService;
        this.chat = new openai_1.ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            temperature: 0.5,
            maxConcurrency: 5,
            streaming: true,
        });
    }
    async generateText(prompt, user, callback) {
        console.log('Generating text for ' + JSON.stringify(user));
        let fullText = '';
        let seq = 0;
        await this.chat.call([new schema_1.HumanMessage(prompt)], {
            callbacks: [
                {
                    handleLLMNewToken(token) {
                        callback(token, seq++);
                        fullText += token;
                    },
                },
            ],
        });
        fullText = fullText.trim();
        const result = await this.mongoService.saveGeneratedText(fullText, user);
        console.log('Text saved to MongoDB:', result);
        return fullText;
    }
};
exports.LangChainService = LangChainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mongo_service_1.MongoService])
], LangChainService);
//# sourceMappingURL=lang-chain.service.js.map