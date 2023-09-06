"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoModule = void 0;
const common_1 = require("@nestjs/common");
const users_module_1 = require("../../mongo/users/users.module");
const jwt_module_1 = require("../jwt/jwt.module");
const cognito_controller_1 = require("./cognito.controller");
const cognito_strategy_1 = require("./cognito.strategy");
const chats_module_1 = require("../../mongo/chats/chats.module");
let CognitoModule = exports.CognitoModule = class CognitoModule {
};
exports.CognitoModule = CognitoModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, jwt_module_1.JwtModule, chats_module_1.ChatsModule],
        controllers: [cognito_controller_1.CognitoController],
        providers: [cognito_strategy_1.CognitoStrategy],
    })
], CognitoModule);
//# sourceMappingURL=cognito.module.js.map