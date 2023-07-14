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
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const AWS = require("aws-sdk");
const config_1 = require("@nestjs/config");
const stream_1 = require("stream");
let FileUploadService = exports.FileUploadService = class FileUploadService {
    constructor(configService) {
        this.configService = configService;
        this.s3 = new AWS.S3({
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            region: this.configService.get('AWS_REGION'),
        });
    }
    async uploadFile(buffer, name, type, user) {
        const readableStream = new stream_1.Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        const params = {
            Bucket: user.id,
            Key: name,
            Body: readableStream,
            ACL: 'public-read',
            ContentType: type,
        };
        return new Promise((resolve, reject) => {
            this.s3.upload(params, (error, data) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(data.Location);
                }
            });
        });
    }
    async generateUploadUrl(filename, mimetype, user) {
        const params = {
            Bucket: `${this.configService.get('AWS_S3_BUCKET_NAME')}/${user.id}`,
            Key: filename,
            ContentType: mimetype,
            Expires: 60 * 60,
        };
        console.log(params);
        console.log(user);
        return this.s3.getSignedUrlPromise('putObject', params);
    }
    async listFiles(user) {
        const params = {
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Prefix: `${user.id}/`,
        };
        return new Promise((resolve, reject) => {
            this.s3.listObjects(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    console.log(data);
                    resolve(data.Contents);
                }
            });
        });
    }
};
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileUploadService);
//# sourceMappingURL=fileupload.service.js.map