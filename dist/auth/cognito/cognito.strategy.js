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
var CognitoStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_oauth2_1 = require("passport-oauth2");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const users_service_1 = require("../../mongo/users/users.service");
const chats_service_1 = require("../../mongo/chats/chats.service");
let CognitoStrategy = exports.CognitoStrategy = CognitoStrategy_1 = class CognitoStrategy extends (0, passport_1.PassportStrategy)(passport_oauth2_1.Strategy, 'cognito') {
    constructor(configService, usersService, chatsService) {
        super({
            authorizationURL: CognitoStrategy_1.authorizationUrl(configService.get('OAUTH_COGNITO_DOMAIN'), configService.get('OAUTH_COGNITO_REGION')),
            tokenURL: CognitoStrategy_1.tokenUrl(configService.get('OAUTH_COGNITO_DOMAIN'), configService.get('OAUTH_COGNITO_REGION')),
            clientID: configService.get('OAUTH_COGNITO_ID'),
            clientSecret: configService.get('OAUTH_COGNITO_SECRET'),
            callbackURL: configService.get('OAUTH_COGNITO_REDIRECT_URL'),
        });
        this.usersService = usersService;
        this.chatsService = chatsService;
        this.domain = configService.get('OAUTH_COGNITO_DOMAIN');
        this.region = configService.get('OAUTH_COGNITO_REGION');
        this.clientId = configService.get('OAUTH_COGNITO_ID');
    }
    static baseUrl(domain, region) {
        return `https://${domain}.auth.${region}.amazoncognito.com/oauth2`;
    }
    static authorizationUrl(domain, region) {
        return `${this.baseUrl(domain, region)}/authorize`;
    }
    static tokenUrl(domain, region) {
        return `${this.baseUrl(domain, region)}/token`;
    }
    static userInfoUrl(domain, region) {
        return `${this.baseUrl(domain, region)}/userInfo`;
    }
    async validate(accessToken) {
        const userinfo = (await axios_1.default.get(CognitoStrategy_1.userInfoUrl(this.domain, this.region), {
            headers: { Authorization: `Bearer ${accessToken}` },
        })).data;
        console.log('userinfo: ', userinfo);
        let user = await this.usersService.findOne({ userId: userinfo.sub });
        console.log('user: ', user);
        if (user == null) {
            const tempChat = await this.chatsService.createTempChat();
            console.log('tempChat: ', tempChat);
            user = await this.usersService.create({
                provider: 'cognito',
                userId: userinfo.sub,
                name: userinfo.name,
                email: userinfo.email,
                username: userinfo.username,
                chats: [tempChat._id],
                role: 'authenticated user',
            });
        }
        return user;
    }
};
exports.CognitoStrategy = CognitoStrategy = CognitoStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService,
        chats_service_1.ChatsService])
], CognitoStrategy);
//# sourceMappingURL=cognito.strategy.js.map