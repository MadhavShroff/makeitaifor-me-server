import { FileUploadService } from './fileupload.service';
export declare class FileUploadController {
    private fileUploadService;
    constructor(fileUploadService: FileUploadService);
    uploadFile(file: any, req: any): Promise<{
        url: string;
    }>;
    generateUploadUrl(filename: string, mimetype: string, req: any): Promise<{
        uploadUrl: string;
    }>;
    listFiles(req: any): Promise<{
        files: any[];
    }>;
    fileUploaded(userId: string, fileName: string, res: any): Promise<any>;
}
