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
exports.FileUploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fileupload_service_1 = require("./fileupload.service");
const lang_chain_service_1 = require("../lang-chain/lang-chain.service");
const jwt_guard_1 = require("../auth/jwt/jwt.guard");
const validator_1 = require("validator");
const mongo_service_1 = require("../mongo/mongo.service");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let FileUploadController = exports.FileUploadController = class FileUploadController {
    constructor(fileUploadService, mongoService, configService, langChainService) {
        this.fileUploadService = fileUploadService;
        this.mongoService = mongoService;
        this.configService = configService;
        this.langChainService = langChainService;
    }
    async uploadFile(file, req) {
        const { originalname, buffer, mimetype } = file;
        const url = await this.fileUploadService.uploadFile(buffer, originalname, mimetype, { user: req.user });
        return { url };
    }
    async getDocumentContent(req) {
        const { fileKey } = req.body;
        if (!fileKey) {
            console.log('File key not found', fileKey);
            throw new common_1.HttpException('File not found', common_1.HttpStatus.NOT_FOUND);
        }
        try {
            const text = await this.mongoService.getProcessedText(fileKey);
            if (!text) {
                throw new common_1.HttpException('File not found', common_1.HttpStatus.NOT_FOUND);
            }
            return { text };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async generateUploadUrl(filename, mimetype, req) {
        console.log(req.user);
        const uploadUrl = await this.fileUploadService.generateUploadUrl(filename, mimetype, req.user);
        return { uploadUrl };
    }
    async listFiles(userId) {
        const files = await this.fileUploadService.listFiles(userId);
        return { files };
    }
    async fileUploaded(objKey, res) {
        objKey = decodeURIComponent(objKey).replace(/\+/g, ' ');
        if ((await this.validateObjKey(objKey)) === false) {
            console.log('Invalid objKey received (BAD/CORRUPTED REQUEST): ' + objKey);
            return res.status(400).json({ status: 'Bad Request' });
        }
        console.log('S3 File uploaded: ' + JSON.stringify(objKey) + ' Now processing...');
        const parsedString = await this.processDocument(objKey);
        try {
            const embeddingPromise = this.langChainService.createEmbedding(this.langChainService.getAlphanumericString(objKey), parsedString);
            const savePromise = this.mongoService.saveProcessedText(objKey.substring(0, 36), objKey, parsedString);
            res.status(200).json({ status: 'acknowledged' });
            await Promise.all([embeddingPromise, savePromise]);
            console.log('Processed Text Saved to MongoDB');
        }
        catch (error) {
            console.error('Operation failed:', error);
            return res
                .status(500)
                .json({ status: 'Internal Server Error', error: error });
        }
    }
    async validateObjKey(objKey) {
        const sanitizedObjKey = validator_1.default.escape(objKey).substring(0, 36);
        const isUUIDValid = validator_1.default.isUUID(sanitizedObjKey, 4);
        if (isUUIDValid) {
            return true;
        }
        return false;
    }
    async processDocument(objKey) {
        const url = await this.fileUploadService.generateTemporaryDownloadUrl(objKey);
        const pdf_id = await this.callMathpixApi(url);
        let statusResponse;
        do {
            await new Promise((resolve) => setTimeout(resolve, 5000));
            statusResponse = await this.checkProcessingStatus(pdf_id);
            if (statusResponse.status === 'error') {
                throw new common_1.HttpException('Error in processing the document', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            console.log('Status Response: ', statusResponse);
        } while (statusResponse.status !== 'completed' &&
            statusResponse.status !== 'error');
        return await this.getCompletedResult(pdf_id);
    }
    async callMathpixApi(url) {
        const data = { url: url };
        const headers = {
            app_id: this.configService.get('MATHPIX_APP_ID'),
            app_key: this.configService.get('MATHPIX_APP_KEY'),
            'Content-type': 'application/json',
        };
        return axios_1.default
            .post('https://api.mathpix.com/v3/pdf', data, { headers })
            .then((response) => response.data.pdf_id)
            .catch((error) => console.error(error));
    }
    async checkProcessingStatus(pdfId) {
        return (0, axios_1.default)({
            method: 'GET',
            url: `https://api.mathpix.com/v3/pdf/${pdfId}`,
            headers: {
                app_id: this.configService.get('MATHPIX_APP_ID'),
                app_key: this.configService.get('MATHPIX_APP_KEY'),
            },
        }).then((response) => response.data);
    }
    async getCompletedResult(pdfId) {
        return (0, axios_1.default)({
            method: 'GET',
            url: `https://api.mathpix.com/v3/pdf/${pdfId}.mmd`,
            headers: {
                app_id: this.configService.get('MATHPIX_APP_ID'),
                app_key: this.configService.get('MATHPIX_APP_KEY'),
            },
        }).then((response) => {
            return response.data;
        });
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('/getDocumentContent'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "getDocumentContent", null);
__decorate([
    (0, common_1.Get)('generate-presigned-url'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('filename')),
    __param(1, (0, common_1.Query)('mimetype')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "generateUploadUrl", null);
__decorate([
    (0, common_1.Get)('list-files/:userId'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "listFiles", null);
__decorate([
    (0, common_1.Get)('/s3-file-uploaded'),
    __param(0, (0, common_1.Query)('objKey')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FileUploadController.prototype, "fileUploaded", null);
exports.FileUploadController = FileUploadController = __decorate([
    (0, common_1.Controller)('fileupload'),
    __metadata("design:paramtypes", [fileupload_service_1.FileUploadService,
        mongo_service_1.MongoService,
        config_1.ConfigService,
        lang_chain_service_1.LangChainService])
], FileUploadController);
//# sourceMappingURL=fileupload.controller.js.map