import { Injectable } from '@nestjs/common';
import { OpenAI } from 'langchain/llms/openai';
import { User } from 'src/types/user';

@Injectable()
export class LangChainService {
  private llm: OpenAI;

  constructor() {
    this.llm = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.5,
    });
  }

  async generateText(prompt: string, user: User): Promise<string> {
    console.log('Generating text for ' + JSON.stringify(user));
    return this.llm.predict(prompt);
    // TODO: save the result to the database
    // TODO: deduct the user's credits -> create DatabaseService with a set of static async methods
    // return result;
  }
}
