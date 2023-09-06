import { Model, Types } from 'mongoose';
import { Chat, MessageVersion } from './chat.schema';
import { User } from '../users/users.schema';
export declare class ChatsService {
    private readonly chatModel;
    private readonly userModel;
    constructor(chatModel: Model<Chat>, userModel: Model<User>);
    createTempChat(): Promise<Chat>;
    createChat(obj: any): Promise<Chat>;
    addChatToUser(userId: string, chatId: Types.ObjectId): Promise<User>;
    findChatByChatId(chatId: Types.ObjectId): Promise<Chat>;
    appendMessage(chatId: Types.ObjectId, message: MessageVersion): Promise<Chat>;
}
