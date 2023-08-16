import { Model } from 'mongoose';
import { User } from 'src/types/user';
export declare class MongoService {
    private readonly generatedTextModel;
    private readonly processedTextModel;
    constructor(generatedTextModel: Model<any>, processedTextModel: Model<any>);
    saveGeneratedText(text: string, user: User): Promise<void>;
    saveProcessedText(userId: string, fileName: string, text: string): Promise<void>;
}