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

  async createNewChat(): Promise<Chat> {
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

  async createMessage(obj: MessageVersion): Promise<Message> {
    const newMessageVersion = new this.messageVersionModel(
      obj == undefined ? {} : obj,
    );
    const mv = await newMessageVersion.save();
    console.log('New Message Version: ', mv);
    const newMessage = new this.messageModel({
      versions: [mv._id],
    });
    const res = await newMessage.save();
    console.log(res);
    res.populate('versions');
    return res;
  }

  /**
   * Checks if a chat with no messages exists for user with userId, returns User[userId].chats if true. else returns null
   * @param userId The ID of the user
   */
  async emptyChatExists(userId: string): Promise<Types.ObjectId[]> {
    const user: User = await this.userModel
      .findOne({
        userId: userId,
        'chats.messages': { $exists: true, $size: 0 },
      })
      .exec();
    console.log('Chat found at emptyChatExists: ', JSON.stringify(user));
    if (user != null) return user.chats;
    else if (user === null) return null;
  }

  /**
   *
   * @param userId The ID of the user
   * @param chatId The ID of the chat that is to be added to a user with userId
   * @returns the updated chats array of the user
   */
  async addChatToUser(
    userId: string,
    chatId: Types.ObjectId,
  ): Promise<Types.ObjectId[]> {
    try {
      const updatedUser = await this.userModel
        .findOneAndUpdate(
          { userId: userId, chats: { $ne: chatId } },
          {
            $push: {
              chats: {
                $each: [chatId], // Specify the items you want to add as an array
                $position: 0, // Position 0 means the beginning of the array
              },
            },
          },
          { new: true }, // This option ensures that the method returns the modified document rather than the original
        )
        .populate('chats')
        .exec();

      console.log('User found at addChatToUser: ', JSON.stringify(updatedUser));

      if (updatedUser) {
        return updatedUser.chats;
      }
    } catch (err) {
      console.log('Error at addChatToUser: ', err);
    }
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
    return await this.findChatByChatId(chatId);
  }

  async getMessagesData(messages: Types.ObjectId[]): Promise<Message[]> {
    return this.messageModel
      .find({ _id: { $in: messages } })
      .populate('versions')
      .exec();
  }

  async getChatsMetadata(userId: string): Promise<User> {
    const user = await this.userModel
      .findOne({ userId })
      .populate('chats')
      .exec();
    // Does not scale well, but woeks for now
    console.log('User found at getChatsMetadata: ', JSON.stringify(user));
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  /**
   * returns true if a title exists, ie is not "New Chat" for the chat with chatId
   * @param chatId The ID of the chat
   */
  async titleExistsForChat(chatId: any): Promise<boolean> {
    const exists = await this.chatModel.exists({
      _id: chatId,
      title: { $eq: 'New Chat' },
    });
    console.log('Title exists for chat: ', exists);
    if (exists != null) return true;
    else return false;
  }
}
