import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../mongo/users/users.schema';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel('GeneratedText')
    private readonly generatedTextModel: Model<any>,
    @InjectModel('ProcessedText')
    private readonly processedTextModel: Model<any>,
    @InjectModel('MessageVersion')
    private readonly messageVersionModel: Model<any>,
  ) {}

  async saveGeneratedText(text: string, versionId: string) {
    const result = await this.messageVersionModel.updateOne(
      { _id: versionId },
      { $set: { text: text, updatedAt: new Date() } },
    );
    console.log('Saved Generated Text: ', result);

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

  async saveProcessedText(userId: string, fileId: string, text: string) {
    const generatedText = new this.processedTextModel({
      userId: userId,
      text: text,
      Etag: fileId,
      timestamp: new Date(),
    });
    await generatedText.save();
  }

  async getProcessedText(userId: string, ETag: string) {
    const processedText = await this.processedTextModel.findOne({
      userId: userId,
      Etag: ETag,
    });
    return processedText.text;
  }
}
