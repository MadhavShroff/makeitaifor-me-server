import { Model } from 'mongoose';
import { User } from 'src/types/user';
export declare class MongoService {
    private readonly generatedTextModel;
    constructor(generatedTextModel: Model<any>);
    saveGeneratedText(text: string, user: User): Promise<void>;
}
