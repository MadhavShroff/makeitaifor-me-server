import { ChatsService } from './chats.service';
export declare class ChatsResolver {
    private readonly chatsService;
    constructor(chatsService: ChatsService);
    createChat(userId: string): Promise<any>;
}
