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
exports.SecretsManagerService = void 0;
const common_1 = require("@nestjs/common");
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
let SecretsManagerService = exports.SecretsManagerService = class SecretsManagerService {
    constructor() {
        this.secret_name = 'prod/AllTheSecrets';
        this.client = new client_secrets_manager_1.SecretsManagerClient({
            region: 'us-east-2',
        });
    }
    async getSecret(secretName) {
        let response;
        try {
            response = await this.client.send(new client_secrets_manager_1.GetSecretValueCommand({
                SecretId: this.secret_name,
                VersionStage: 'AWSCURRENT',
            }));
        }
        catch (error) {
            throw error;
        }
        const secrets = response.SecretString;
        return secrets;
    }
};
exports.SecretsManagerService = SecretsManagerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SecretsManagerService);
//# sourceMappingURL=secrets.js.map