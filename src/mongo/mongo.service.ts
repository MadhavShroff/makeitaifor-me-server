import { Injectable } from '@nestjs/common';
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
    this.messageVersionModel
      .updateOne({
        filter: { _id: versionId },
        update: { generatedText: text },
      })
      .then((res) => {
        console.log(res);
      });
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
