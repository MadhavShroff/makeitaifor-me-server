/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage } from 'langchain/schema';
import { MongoService } from 'src/mongo/mongo.service';
import { User } from 'src/types/user';

@Injectable()
export class LangChainService {
  private chat: ChatOpenAI;

  constructor(
    private readonly mongoService: MongoService, // Inject your MongoDB service or repository
  ) {
    this.chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.5,
      maxConcurrency: 5,
      streaming: true,
    });
  }

  async generateText(
    prompt: string,
    user: User,
    callback: (text: string, seq: number) => void,
  ): Promise<string> {
    console.log('Generating text for ' + JSON.stringify(user));

    let fullText = '';

    // Create the request for the OpenAI API, based on the appropriate options

    // Start the stream
    let seq = 0;
    await this.chat.call(
      [new HumanMessage(prompt)],
      {
        callbacks: [
          {
            handleLLMNewToken(token: string) {
              callback(token, seq++);
              fullText += token;
            },
          },
        ],
      });

    fullText = fullText.trim();

    // Once finished, save the fullText in MongoDB
    const result = await this.mongoService.saveGeneratedText(fullText, user);
    console.log('Text saved to MongoDB:', result);

    return fullText;
  }
}
