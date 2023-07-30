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
    return this.llm.predict(prompt);
    // TODO: save the result to the database
    // TODO: deduct the user's credits
    // return result;
  }
}
