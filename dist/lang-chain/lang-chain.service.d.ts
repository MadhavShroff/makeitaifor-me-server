import { User } from 'src/types/user';
export declare class LangChainService {
    private llm;
    constructor();
    generateText(prompt: string, user: User): Promise<string>;
}
