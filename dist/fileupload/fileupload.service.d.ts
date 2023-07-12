/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
export declare class FileUploadService {
    private configService;
    private s3;
    constructor(configService: ConfigService);
    uploadFile(buffer: Buffer, name: string, type: string, user: any): Promise<string>;
    generateUploadUrl(filename: string, mimetype: string, user: any): Promise<string>;
}
