import { ConfigService } from '@nestjs/config';
import { FileUploadService } from 'src/fileupload/fileupload.service';
import { MongoService } from 'src/mongo/mongo.service';
import { FileData } from 'src/types';
export declare class ChatController {
    private fileUploadService;
    private mongoService;
    private configService;
    constructor(fileUploadService: FileUploadService, mongoService: MongoService, configService: ConfigService);
    getDocumentContent(ETag: string, userId: string, req: any): Promise<FileData | null>;
}
