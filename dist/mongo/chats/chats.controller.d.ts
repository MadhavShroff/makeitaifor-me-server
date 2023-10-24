import { ChatsService } from './chats.service';
import { Types } from 'mongoose';
import { UsersService } from '../users/users.service';
export declare class ChatsController {
    private chatsService;
    private usersService;
    constructor(chatsService: ChatsService, usersService: UsersService);
    getChatsMetadata(req: any, userId: string): Promise<import("../users/users.schema").User>;
    getMessagesData(req: any): Promise<import("./chat.schema").Message[]>;
    createNewChat(req: any): Promise<Types.ObjectId[]>;
    getModels(): Promise<({
        color: string;
        name: string;
        image?: undefined;
    } | {
        image: string;
        name: string;
        color?: undefined;
    })[]>;
}
