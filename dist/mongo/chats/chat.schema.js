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
exports.ChatSchema = exports.Chat = exports.MessageSchema = exports.Message = exports.MessageVersionSchema = exports.MessageVersion = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const graphql_1 = require("@nestjs/graphql");
let MessageVersion = exports.MessageVersion = class MessageVersion extends mongoose_2.Document {
};
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], MessageVersion.prototype, "text", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ type: String, enum: ['user', 'ai'], required: true }),
    __metadata("design:type", String)
], MessageVersion.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], MessageVersion.prototype, "isActive", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], MessageVersion.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], MessageVersion.prototype, "versionNumber", void 0);
exports.MessageVersion = MessageVersion = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, mongoose_1.Schema)()
], MessageVersion);
exports.MessageVersionSchema = mongoose_1.SchemaFactory.createForClass(MessageVersion);
let Message = exports.Message = class Message extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.MessageVersionSchema], default: [] }),
    __metadata("design:type", Array)
], Message.prototype, "versions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Message' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Message.prototype, "previousMessage", void 0);
exports.Message = Message = __decorate([
    (0, mongoose_1.Schema)()
], Message);
exports.MessageSchema = mongoose_1.SchemaFactory.createForClass(Message);
let Chat = exports.Chat = class Chat extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Chat.prototype, "chatId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.MessageSchema], default: [] }),
    __metadata("design:type", Array)
], Chat.prototype, "messages", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Chat.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Chat.prototype, "updatedAt", void 0);
exports.Chat = Chat = __decorate([
    (0, mongoose_1.Schema)()
], Chat);
exports.ChatSchema = mongoose_1.SchemaFactory.createForClass(Chat);
//# sourceMappingURL=chat.schema.js.map