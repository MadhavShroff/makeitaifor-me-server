import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel('GeneratedText')
    private readonly generatedTextModel: Model<any>,
    @InjectModel('ProcessedText')
    private readonly processedTextModel: Model<any>,
    @InjectModel('MessageVersion')
    private readonly messageVersionModel: Model<any>,
    @InjectModel('Chat')
    private readonly chatModel: Model<any>,
  ) {}

  async saveGeneratedText(text: string, versionId: string) {
    const result = await this.messageVersionModel.updateOne(
      { _id: versionId },
      { $set: { text: text, updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      console.error(`Failed to find message version with ID ${versionId}`);
      throw new NotFoundException(`Chat with ID ${versionId} not found`);
    }

    if (result.modifiedCount === 0) {
      console.warn(
        `No documents were modified during the update operation for chat ID ${versionId}`,
      );
    }
  }

  async saveGeneratedTitle(newTitle: string, chatId: string) {
    const result = await this.chatModel.findOneAndUpdate(
      { _id: chatId },
      { $set: { title: newTitle, updatedAt: new Date() } },
      { new: true },
    );

    if (result.matchedCount === 0) {
      console.error(`Failed to find chat with ID ${chatId}`);
      throw new NotFoundException(`Chat with ID ${chatId} not found`);
    }

    if (result.modifiedCount === 0) {
      console.warn(
        `No documents were modified during the update operation for chat ID ${chatId}`,
      );
    }
  }

  async saveProcessedText(userId: string, fileKey: string, text: string) {
    const generatedText = new this.processedTextModel({
      userId: userId,
      text: text,
      Key: fileKey,
      timestamp: new Date(),
    });
    const res = await generatedText.save();
    return res;
  }

  async getProcessedText(Key: string) {
    const processedText = await this.processedTextModel.findOne({
      Key: Key,
    });
    return processedText.text;
  }
}
