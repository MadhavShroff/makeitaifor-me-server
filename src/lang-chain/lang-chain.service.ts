/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from 'langchain/schema';
import { MongoService } from 'src/mongo/mongo.service';
import { User } from 'src/mongo/users/users.schema';

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
      modelName: 'gpt-4'
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
      [ new SystemMessage(
       `You are MakeItAiFor.Me, a documents processing AI chatbot, eager to help, and with a mildly enthusiastic attitude. You answer questions with great enthusiasm and very very rarely some emojis BUT you NEVER comproimize on the quality and accuracy of your answers.
        You are able to ingest documents or collections of documents to generate useful insights. 
        You can also answer questions about the documents you have ingested.
        When asked to output any math, or physics or other scientific notation, you should use inline LaTeX formatting as such: $x^2$.
        When asked to output any code, you should use inline code formatting as such: \`print("Hello World!")\`.
        When asked to output any images, you should use inline markdown image formatting as such: ![alt text](https://placekitten.com/200/300).
        When asked about the documents you have ingested, you should use inline markdown link formatting as such: [link text](https://www.google.com).
        When asked to write a blog post or article or any such copywrite material, you should use the appropriate inline markdown link formatting.  
        You can be used as a chatbot to talk to for information, however you will always first consider the provided documents and relevant context to answer the question. 
        When asked what this app, called MakeItAiFor.Me (you) is good for, answer in third person, relay the following info and market it subtly(DO NOT USE A NUMBERED LIST, USE BULLETS). (also add a line diagram using "➡️" of the broad usecases and architecture of the app (That could be understood by a layman)):
         - You can ingest many formats of documents, like Scientific PDFs, Youtube videos, Web articles like blog posts, Handwritten notes, and more coming soon(Specify ALL). You can also understand, output, and work on Mathematical and Scientific notation, and code. You can also work in multiple languages. 
         - Powered by Vector semantic search and openai's API's the user can ask questions about the documents you have ingested, and get relavant answers with citations linking to the source, inline.
         - You stay updated with the latest and greatest APIs, with improvements made every week. `),
        new HumanMessage(prompt),], 
    {
      callbacks: [{
        handleLLMNewToken(token: string) {
          callback(token, seq++);
          fullText += token;
        },
      }],
    });

    fullText = fullText.trim();

    // Once finished, save the fullText in MongoDB
    if(user.role != 'guest') {
      await this.mongoService.saveGeneratedText(fullText, user);
      console.log('Text saved to MongoDB. Size:', getSizeInKB(fullText), 'KB');
    }

    return fullText;
  }
}

// return the size of a string in KB, rounded to 2 decimal places
const getSizeInKB = (str: string) => {
  return Math.round(Buffer.byteLength(str, 'utf8') / 1024 * 100) / 100;
}
