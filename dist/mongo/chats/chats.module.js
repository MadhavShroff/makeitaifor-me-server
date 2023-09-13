"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const chat_schema_1 = require("./chat.schema");
const chats_service_1 = require("./chats.service");
const chats_resolver_1 = require("./chats.resolver");
const users_schema_1 = require("../users/users.schema");
const chats_controller_1 = require("./chats.controller");
const users_module_1 = require("../users/users.module");
let ChatsModule = exports.ChatsModule = class ChatsModule {
};
exports.ChatsModule = ChatsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: chat_schema_1.Chat.name, schema: chat_schema_1.ChatSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: chat_schema_1.Message.name, schema: chat_schema_1.MessageSchema }]),
            mongoose_1.MongooseModule.forFeature([
                { name: chat_schema_1.MessageVersion.name, schema: chat_schema_1.MessageVersionSchema },
            ]),
            mongoose_1.MongooseModule.forFeature([{ name: users_schema_1.User.name, schema: users_schema_1.UserSchema }]),
            users_module_1.UsersModule,
        ],
        providers: [chats_service_1.ChatsService, chats_resolver_1.ChatsResolver],
        exports: [chats_service_1.ChatsService],
        controllers: [chats_controller_1.ChatsController],
    })
], ChatsModule);
//# sourceMappingURL=chats.module.js.map