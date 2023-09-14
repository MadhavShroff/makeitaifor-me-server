import { Model } from 'mongoose';
export declare class MongoService {
    private readonly generatedTextModel;
    private readonly processedTextModel;
    private readonly messageVersionModel;
    private readonly chatModel;
    constructor(generatedTextModel: Model<any>, processedTextModel: Model<any>, messageVersionModel: Model<any>, chatModel: Model<any>);
    saveGeneratedText(text: string, versionId: string): Promise<void>;
    saveGeneratedTitle(title: string, chatId: string): Promise<void>;
    saveProcessedText(userId: string, fileId: string, text: string): Promise<void>;
    getProcessedText(userId: string, ETag: string): Promise<any>;
}
