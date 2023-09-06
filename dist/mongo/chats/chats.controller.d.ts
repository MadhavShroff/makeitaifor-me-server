import { MongoService } from 'src/mongo/mongo.service';
import { ChatsService } from './chats.service';
export declare class MongoController {
    private mongoService;
    private chatsService;
    constructor(mongoService: MongoService, chatsService: ChatsService);
    getChatsMetadata(req: any): Promise<import("../users/users.schema").User>;
}
