import { MongoService } from 'src/mongo/mongo.service';
import { User } from 'src/mongo/users/users.schema';
export declare class LangChainService {
    private readonly mongoService;
    private chat4;
    private chat3;
    constructor(mongoService: MongoService);
    generateText(prompt: string, user: User, versionId: string, callback: (text: string, seq: number) => void): Promise<string>;
    setTitle(query: string, response: string, chatId: string, callback: (text: string) => void): Promise<string>;
}
