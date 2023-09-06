/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Document, Types } from 'mongoose';
export declare class MessageVersion extends Document {
    text: string;
    type: string;
    isActive: boolean;
    createdAt: Date;
    versionNumber: number;
}
export declare const MessageVersionSchema: import("mongoose").Schema<MessageVersion, import("mongoose").Model<MessageVersion, any, any, any, Document<unknown, any, MessageVersion> & Omit<MessageVersion & {
    _id: Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MessageVersion, Document<unknown, {}, import("mongoose").FlatRecord<MessageVersion>> & Omit<import("mongoose").FlatRecord<MessageVersion> & {
    _id: Types.ObjectId;
}, never>>;
export declare class Message extends Document {
    versions: MessageVersion[];
    previousMessage: Types.ObjectId;
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message> & Omit<Message & {
    _id: Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>> & Omit<import("mongoose").FlatRecord<Message> & {
    _id: Types.ObjectId;
}, never>>;
export declare class Chat extends Document {
    chatId: Types.ObjectId;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const ChatSchema: import("mongoose").Schema<Chat, import("mongoose").Model<Chat, any, any, any, Document<unknown, any, Chat> & Omit<Chat & {
    _id: Types.ObjectId;
}, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Chat, Document<unknown, {}, import("mongoose").FlatRecord<Chat>> & Omit<import("mongoose").FlatRecord<Chat> & {
    _id: Types.ObjectId;
}, never>>;
