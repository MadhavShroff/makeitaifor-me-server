import { Model } from 'mongoose';
export declare class MongoService {
    private readonly generatedTextModel;
    private readonly processedTextModel;
    private readonly messageVersionModel;
    constructor(generatedTextModel: Model<any>, processedTextModel: Model<any>, messageVersionModel: Model<any>);
    saveGeneratedText(text: string, versionId: string): Promise<void>;
    saveProcessedText(userId: string, fileId: string, text: string): Promise<void>;
    getProcessedText(userId: string, ETag: string): Promise<any>;
}
