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
  ) {}

  async createTempChat(): Promise<Chat> {
    const newChat = new this.chatModel({});
    return await newChat.save();
  }

  async createChat(obj: undefined | any): Promise<Chat> {
    const newChat = new this.chatModel(obj == undefined ? {} : obj);
    return await newChat.save();
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

  async findChatByChatId(chatId: Types.ObjectId): Promise<Chat> {
    const chat = await this.chatModel.findById(chatId).exec();
    if (!chat) return null;
    else return chat;
  }

  async appendMessage(
    chatId: Types.ObjectId,
    message: MessageVersion,
  ): Promise<Chat> {
    const chat = await this.findChatByChatId(chatId);
    if (chat == null) {
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    const newMessage = {
      versions: [message],
      previousMessage: null,
    } as Partial<Message>;

    chat.messages.push(newMessage as Message);
    chat.updatedAt = new Date();

    return await chat.save();
  }

  async getChatsMetadata(userId: string): Promise<User> {
    const user = await this.userModel
      .findOne({ id: userId })
      .populate('chats')
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
