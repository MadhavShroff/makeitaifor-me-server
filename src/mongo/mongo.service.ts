import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/types/user';

@Injectable()
export class MongoService {
  constructor(
    @InjectModel('GeneratedText')
    private readonly generatedTextModel: Model<any>,
  ) {}

  async saveGeneratedText(text: string, user: User) {
    const generatedText = new this.generatedTextModel({
      userId: user.id,
      text: text,
    });
    await generatedText.save();
  }
}
