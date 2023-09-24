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
const text_splitter_1 = require("langchain/text_splitter");
const openai_2 = require("langchain/embeddings/openai");
const mongo_service_1 = require("../mongo/mongo.service");
const pinecone_1 = require("@pinecone-database/pinecone");
const document_1 = require("langchain/document");
let LangChainService = exports.LangChainService = class LangChainService {
    constructor(mongoService) {
        this.mongoService = mongoService;
        this.chat4 = new openai_1.ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            temperature: 0.72,
            streaming: true,
            modelName: 'gpt-4'
        });
        this.chat3 = new openai_1.ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            temperature: 0.72,
            streaming: true,
            modelName: 'gpt-3.5-turbo'
        });
        this.pinecone = new pinecone_1.Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
            environment: process.env.PINECONE_ENVIRONMENT,
        });
    }
    getAlphanumericString(str) {
        str.replace(/\W/g, '');
        console.log("Replaced string", str);
        return str;
    }
    async createEmbedding(objKey, text) {
        const embedder = new openai_2.OpenAIEmbeddings({
            modelName: "text-embedding-ada-002",
        });
        const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 100,
            chunkOverlap: 10,
        });
        const docs = await splitter.splitDocuments([
            new document_1.Document({ pageContent: text }),
        ]);
        console.log("First 5 objects in docs :", JSON.stringify(docs.slice(0, 5)));
        console.log("Split into :", docs.length, "chunks");
        const embeddings = (await embedder.embedDocuments(docs.map((doc) => doc.pageContent)));
        const records = await docs.map((doc, i) => {
            return {
                id: i.toString(),
                values: embeddings[i],
                metadata: {
                    content: doc.pageContent,
                },
            };
        });
        console.log("Number of Records :", records.length);
        const res = await this.pinecone.createIndex({
            metric: "cosine",
            name: objKey,
            dimension: 1536,
            waitUntilReady: true,
        });
        console.log("Index created", res);
        await this.pinecone.Index(objKey).upsert(records);
        console.log(JSON.stringify(await this.pinecone.describeIndex(objKey)));
        console.log("Index created", objKey);
        return true;
    }
    async deleteEmbedding(objKey) {
        return this.pinecone.deleteIndex(objKey).then(() => {
            console.log('Index deleted', objKey);
            return true;
        }).catch((err) => {
            console.error('Error deleting index', err);
            return false;
        });
    }
    async generateText(prompt, user, versionId, previousConversation, callback) {
        console.log('Generating text for ' + JSON.stringify(user) + ' with prompt: ' + prompt);
        if (prompt === undefined)
            throw new Error('@lang-chain.service.ts: Parameter prompt is undefined');
        let fullText = '';
        let seq = 0;
        await this.chat4.call([new schema_1.SystemMessage(`You are MakeItAiFor.Me, a documents processing AI chatbot, eager to help, and with a mildly enthusiastic attitude. You answer questions with zeal and very very rarely emojis in approprioate contexts. You NEVER comproimize on the quality and accuracy and professional, formal presentation of your answers.
        You are able to ingest documents or collections of documents to generate useful insights. 
        You can also answer questions about the documents you have ingested.
        When asked to output any math, or physics or other scientific notation, you should use inline LaTeX formatting as such: $x^2$.
        When asked to output any code, you should use inline code formatting as such: \`print("Hello World!")\`.
        When asked to output any images, you should use inline markdown image formatting as such: ![alt text](https://placekitten.com/200/300).
        When asked about the documents you have ingested, you should use inline markdown link formatting as such: [link text](https://www.google.com).
        When asked to write a blog post or article or any such copywrite material, you should use the appropriate inline markdown link formatting.  
        You can be used as a chatbot to talk to for information, however you will always first consider the provided documents and relevant context to answer the question. 
        When asked what this app, called MakeItAiFor.Me (you) is good for, answer in third person, relay the following info and market it subtly(DO NOT USE A NUMBERED LIST, USE BULLETS). (also add a line diagram using "➡️" of the broad usecases and architecture of the app (That could be understood by a layman)):
         - You can ingest many formats of documents, like Scientific PDFs, Youtube videos, Web articles like blog posts, Handwritten notes, and more coming soon(Specify ALL). You can also understand, output, and work on Mathematical and Scientific notation, and code. You can also work in multiple languages. 
         - Powered by Vector semantic search and openai's API's the user can ask questions about the documents you have ingested, and get relavant answers with citations linking to the source, inline.
         - You stay updated with the latest and greatest APIs, with improvements made every week. `),
            ...previousConversation,
            new schema_1.HumanMessage(prompt),], {
            callbacks: [{
                    handleLLMNewToken(token) {
                        callback(token, seq++);
                        fullText += token;
                    },
                }],
        });
        fullText = fullText.trim();
        await this.mongoService.saveGeneratedText(fullText, versionId);
        console.log('Text saved to MongoDB. Size:', getSizeInKB(fullText), 'KB');
        return fullText;
    }
    async setTitle(query, response, chatId, callback) {
        let title = '';
        await this.chat3.call([
            new schema_1.SystemMessage('You generate the title for the chat using the query and response. The title should be a maximum of 3 words. You can use the following words: ' + query + ' ' + response),
            new schema_1.HumanMessage(`Generate a title for the following chat using this query and response pair. : 
        Query: ${query}
        Response: ${response}`)
        ], {
            callbacks: [{
                    handleLLMNewToken(token) {
                        title += token;
                    },
                }]
        });
        await this.mongoService.saveGeneratedTitle(title, chatId);
        callback(title);
        return title;
    }
};
exports.LangChainService = LangChainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mongo_service_1.MongoService])
], LangChainService);
const getSizeInKB = (str) => {
    return Math.round(Buffer.byteLength(str, 'utf8') / 1024 * 100) / 100;
};
//# sourceMappingURL=lang-chain.service.js.map