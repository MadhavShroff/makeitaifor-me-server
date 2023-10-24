import { BaseMessage, HumanMessage, SystemMessage } from 'langchain/schema';
import { MongoService } from 'src/mongo/mongo.service';
import { User } from 'src/mongo/users/users.schema';
export declare class LangChainService {
    private readonly mongoService;
    private chat4;
    private chat3;
    private pinecone;
    constructor(mongoService: MongoService);
    getAlphanumericString(input: string): string;
    createEmbedding(objKey: string, text: string): Promise<boolean>;
    deleteEmbedding(objKey: string): Promise<boolean>;
    private getMaxContextSize;
    private getTokenCount;
    fitToContextWindow(sys: SystemMessage, prev: BaseMessage[], prompt: HumanMessage, model: string): Promise<BaseMessage[]>;
    generateText(prompt: string, user: User, versionId: string, previousConversation: BaseMessage[], callback: (text: string, seq: number) => void): Promise<string>;
    setTitle(query: string, response: string, chatId: string, callback: (text: string) => void): Promise<string>;
}
