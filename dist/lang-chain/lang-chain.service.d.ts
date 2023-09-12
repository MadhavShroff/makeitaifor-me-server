import { MongoService } from 'src/mongo/mongo.service';
import { User } from 'src/mongo/users/users.schema';
export declare class LangChainService {
    private readonly mongoService;
    private chat;
    constructor(mongoService: MongoService);
    generateText(prompt: string, user: User, versionId: string, callback: (text: string, seq: number) => void): Promise<string>;
}
