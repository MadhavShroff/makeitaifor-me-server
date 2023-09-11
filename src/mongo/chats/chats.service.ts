import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat, Message, MessageVersion } from './chat.schema'; // make sure the path is correct
import { User } from '../users/users.schema';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectModel(MessageVersion.name)
    private readonly messageVersionModel: Model<MessageVersion>,
  ) {}

  async createTempChat(): Promise<Chat> {
    const newChat = new this.chatModel({
      title: 'New Chat',
      messages: [],
    });
    return await newChat.save();
  }

  async createChat(obj?: any): Promise<Chat> {
    const newChat = new this.chatModel(
      obj == undefined
        ? {
            title: 'New Chat',
            messages: [],
          }
        : obj,
    );
    return await newChat.save();
  }

  async createMessage(obj?: any): Promise<Message> {
    const newMessageVersion = new this.messageVersionModel(
      obj == undefined ? {} : obj,
    );
    await newMessageVersion.save();
    const newMessage = new this.messageModel({
      versions: [newMessageVersion],
    });
    const res = await newMessage.save();
    console.log(res);
    return res;
  }

  /**
   *
   * @param userId The ID of the user
   * @param chatId The ID of the chat that is to be added to a user with userId
   * @returns the updated user object, with a new chat added to the chats array
   */
  async addChatToUser(userId: string, chatId: Types.ObjectId): Promise<User> {
    // Complete this function...
    return null;
  }

  /**
   * Finds a chat by its ID
   * @param chatId
   * @returns the chat object
   */
  async findChatByChatId(chatId: Types.ObjectId): Promise<Chat> {
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) return null;
    else return chat;
  }

  /**
   * Appends a message objectId to Chat[chatId].messages
   * @param messageId
   * @param chatId
   */
  async appendMessageToChat(
    messageId: Types.ObjectId,
    chatId: Types.ObjectId,
  ): Promise<Chat> {
    console.log(`Before Append: Message appended to chat with ID ${chatId}`);
    const result = await this.chatModel.updateOne(
      { _id: chatId },
      {
        $push: { messages: messageId },
        $set: { updatedAt: new Date(), title: 'New Chat' },
      },
    );

    console.log(result);

    if (result.matchedCount === 0) {
      console.error(`Failed to find chat with ID ${chatId}`);
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    if (result.modifiedCount === 0) {
      console.warn(
        `No documents were modified during the update operation for chat ID ${chatId}`,
      );
    }

    console.log(`After Append: Message appended to chat with ID ${chatId}`);
    return await this.findChatByChatId(chatId);
  }

  async getChatsMetadata(userId: string): Promise<User> {
    const user = await this.userModel
      .findOne({ userId })
      .populate('chats')
      .populate('chats.messages')
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  // async updateMessage(
  //   chatId: Types.ObjectId,
  //   messageId: Types.ObjectId,
  //   newText: string,
  //   type: string,
  // ): Promise<Chat> {
  //   const chat = await this.chatModel.findById(chatId).exec();
  //   if (!chat) {
  //     throw new NotFoundException(`Chat with ID ${chatId} not found`);
  //   }

  //   // Manually filter to find the message with the specific ID
  //   const message = chat.messages.find(
  //     (msg) => msg._id.toString() === messageId.toString(),
  //   );
  //   if (!message) {
  //     throw new NotFoundException(`Message with ID ${messageId} not found`);
  //   }

  //   const newVersion = {
  //     text: newText,
  //     type,
  //     isActive: true,
  //     createdAt: new Date(),
  //     versionNumber: message.versions.length + 1, // next version number
  //   } as Partial<MessageVersion>;

  //   message.versions.push(newVersion as MessageVersion);
  //   chat.updatedAt = new Date();

  //   return await chat.save();
  // }

  // async fetchActiveChatStream(chatId: Types.ObjectId): Promise<any> {
  //   const chat = await this.chatModel.findById(chatId).exec();
  //   if (!chat) {
  //     throw new NotFoundException(`Chat with ID ${chatId} not found`);
  //   }

  //   const activeStream = chat.messages
  //     .map((message) => {
  //       const activeVersion = message.versions.find(
  //         (version) => version.isActive,
  //       );
  //       if (activeVersion) {
  //         return {
  //           messageId: message._id,
  //           text: activeVersion.text,
  //           type: activeVersion.type,
  //           createdAt: activeVersion.createdAt,
  //         };
  //       }
  //       return null;
  //     })
  //     .filter((item) => item !== null);

  //   return activeStream;
  // }

  // async setActiveVersion(
  //   chatId: Types.ObjectId,
  //   messageId: Types.ObjectId,
  //   versionNumber: number,
  // ): Promise<Chat> {
  //   const chat = await this.chatModel.findById(chatId).exec();
  //   if (!chat) {
  //     throw new NotFoundException(`Chat with ID ${chatId} not found`);
  //   }

  //   // Manually filter to find the message with the specific ID
  //   const message = chat.messages.find(
  //     (msg) => msg._id.toString() === messageId.toString(),
  //   );
  //   if (!message) {
  //     throw new NotFoundException(`Message with ID ${messageId} not found`);
  //   }

  //   // Deactivate all versions
  //   message.versions.forEach((version) => {
  //     version.isActive = false;
  //   });

  //   // Activate the selected version
  //   const version = message.versions.find(
  //     (v) => v.versionNumber === versionNumber,
  //   );
  //   if (!version) {
  //     throw new NotFoundException('Version not found');
  //   }
  //   version.isActive = true;

  //   chat.updatedAt = new Date();

  //   return await chat.save();
  // }
}
