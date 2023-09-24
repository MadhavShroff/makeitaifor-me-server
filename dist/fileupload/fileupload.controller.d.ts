import { FileUploadService } from './fileupload.service';
import { LangChainService } from 'src/lang-chain/lang-chain.service';
import { MongoService } from 'src/mongo/mongo.service';
import { ConfigService } from '@nestjs/config';
export declare class FileUploadController {
    private fileUploadService;
    private mongoService;
    private configService;
    private langChainService;
    constructor(fileUploadService: FileUploadService, mongoService: MongoService, configService: ConfigService, langChainService: LangChainService);
    uploadFile(file: any, req: any): Promise<{
        url: string;
    }>;
    getDocumentContent(req: any): Promise<{
        text: string;
    }>;
    generateUploadUrl(filename: string, mimetype: string, req: any): Promise<{
        uploadUrl: string;
    }>;
    listFiles(userId: string): Promise<{
        files: any[];
    }>;
    fileUploaded(objKey: string, res: any): Promise<any>;
    validateObjKey(objKey: string): Promise<boolean>;
    processDocument(objKey: any): Promise<string>;
    callMathpixApi(url: any): Promise<any>;
    checkProcessingStatus(pdfId: any): Promise<string>;
    getCompletedResult(pdfId: any): Promise<string>;
}
