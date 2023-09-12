import { ChatsService } from './chats.service';
import { Types } from 'mongoose';
export declare class ChatsController {
    private chatsService;
    constructor(chatsService: ChatsService);
    getChatsMetadata(req: any, userId: string): Promise<import("../users/users.schema").User>;
    getMessagesData(req: any): Promise<import("./chat.schema").Message[]>;
    createNewChat(req: any): Promise<Types.ObjectId[]>;
}
