import { ChatsService } from './chats.service';
export declare class ChatsController {
    private chatsService;
    constructor(chatsService: ChatsService);
    getChatsMetadata(req: any): Promise<import("../users/users.schema").User>;
}
