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
const users_module_1 = require("./users/users.module");
const mongoose_1 = require("@nestjs/mongoose");
const fileupload_module_1 = require("./fileupload/fileupload.module");
const app_gateway_1 = require("./gateway/app.gateway");
const lang_chain_service_1 = require("./lang-chain/lang-chain.service");
const jwt_module_1 = require("./auth/jwt/jwt.module");
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            jwt_module_1.JwtModule,
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: async (configService) => ({
                    uri: configService.get('DATABASE_URL'),
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }),
                inject: [config_1.ConfigService],
            }),
            fileupload_module_1.FileuploadModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, app_gateway_1.AppGateway, lang_chain_service_1.LangChainService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map