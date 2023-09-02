"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./mongo/users/users.module");
const fileupload_module_1 = require("./fileupload/fileupload.module");
const app_gateway_1 = require("./gateway/app.gateway");
const lang_chain_service_1 = require("./lang-chain/lang-chain.service");
const jwt_module_1 = require("./auth/jwt/jwt.module");
const mongo_module_1 = require("./mongo/mongo.module");
const lang_chain_module_1 = require("./lang-chain/lang-chain.module");
const chat_module_1 = require("./chat/chat.module");
const dotenv = require("dotenv");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [
                    async () => {
                        dotenv.config({
                            path: process.env.APP_ENV === 'production'
                                ? '/home/ubuntu/makeitaifor-me-server/.env'
                                : '.env',
                        });
                        return process.env;
                    },
                ],
            }),
            jwt_module_1.JwtModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            fileupload_module_1.FileUploadModule,
            mongo_module_1.MongoModule,
            lang_chain_module_1.LangChainModule,
            chat_module_1.ChatModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, app_gateway_1.AppGateway, lang_chain_service_1.LangChainService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map