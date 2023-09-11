import { Model, Types } from 'mongoose';
import { Chat, Message, MessageVersion } from './chat.schema';
import { User } from '../users/users.schema';
export declare class ChatsService {
    private readonly chatModel;
    private readonly userModel;
    private readonly messageModel;
    private readonly messageVersionModel;
    constructor(chatModel: Model<Chat>, userModel: Model<User>, messageModel: Model<Message>, messageVersionModel: Model<MessageVersion>);
    createTempChat(): Promise<Chat>;
    createChat(obj?: any): Promise<Chat>;
    createMessage(obj: MessageVersion): Promise<Message>;
    addChatToUser(userId: string, chatId: Types.ObjectId): Promise<User>;
    findChatByChatId(chatId: Types.ObjectId): Promise<Chat>;
    appendMessageToChat(messageId: Types.ObjectId, chatId: Types.ObjectId): Promise<Chat>;
    getChatsMetadata(userId: string): Promise<User>;
}
