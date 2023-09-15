import { Model, Types } from 'mongoose';
import { Chat, Message, MessageVersion } from './chat.schema';
import { User } from '../users/users.schema';
import { BaseMessage } from 'langchain/schema';
export declare class ChatsService {
    private readonly chatModel;
    private readonly userModel;
    private readonly messageModel;
    private readonly messageVersionModel;
    constructor(chatModel: Model<Chat>, userModel: Model<User>, messageModel: Model<Message>, messageVersionModel: Model<MessageVersion>);
    createNewChat(): Promise<Chat>;
    createChat(obj?: any): Promise<Chat>;
    createMessage(obj: MessageVersion): Promise<Message>;
    emptyChatExists(userId: string): Promise<Types.ObjectId[]>;
    addChatToUser(userId: string, chatId: Types.ObjectId): Promise<Types.ObjectId[]>;
    findChatByChatId(chatId: Types.ObjectId): Promise<Chat>;
    appendMessageToChat(messageId: Types.ObjectId, chatId: Types.ObjectId): Promise<Chat>;
    getMessagesData(messages: Types.ObjectId[]): Promise<Message[]>;
    getChatsMetadata(userId: string): Promise<User>;
    isDefaultTitleForChat(chatId: any): Promise<boolean>;
    getActiveMessages(chatId: string): Promise<BaseMessage[]>;
}
