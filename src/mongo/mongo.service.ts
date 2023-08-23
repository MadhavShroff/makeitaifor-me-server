import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/types/user';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel('GeneratedText')
    private readonly generatedTextModel: Model<any>,
    @InjectModel('ProcessedText')
    private readonly processedTextModel: Model<any>,
  ) {}

  async saveGeneratedText(text: string, user: User) {
    const generatedText = new this.generatedTextModel({
      userId: user.id,
      text: text,
    });
    await generatedText.save();
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

  async getProcessedText(userId: string, fileId: string) {
    const processedText = await this.processedTextModel.findOne({
      userId: userId,
      Etag: fileId,
    });
    return processedText.text;
  }
}
