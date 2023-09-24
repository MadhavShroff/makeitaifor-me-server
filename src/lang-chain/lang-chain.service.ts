/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BaseMessage, HumanMessage, LLMResult, SystemMessage } from 'langchain/schema';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Index, PineconeClient, PineconeRecord, RecordId, RecordMetadata, Vector,} from '@pinecone-database/pinecone'
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MongoService } from 'src/mongo/mongo.service';
import { User } from 'src/mongo/users/users.schema';
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { createIndex } from '@pinecone-database/pinecone/dist/control';
import { PineconeStore } from "langchain/vectorstores/pinecone";

@Injectable()
export class LangChainService {
  private chat4: ChatOpenAI;
  private chat3: ChatOpenAI;
  private pinecone: Pinecone;

  constructor(
    private readonly mongoService: MongoService, // Inject your MongoDB service or repository
  ) {
    this.chat4 = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.72,
      streaming: true,
      modelName: 'gpt-4'
    });
    this.chat3 = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.72,
      streaming: true,
      modelName: 'gpt-3.5-turbo'
    });
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });
  }
  /**
   * returns true if the embedding was created successfully
   * @param objKey 
   * @param text 
   */
  async createEmbedding(objKey: string, text: string) : Promise<boolean> {

    const embedder = new OpenAIEmbeddings({
      modelName: "text-embedding-ada-002",
    });

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 10,
      chunkOverlap: 1,
    });

    const docs = await splitter.splitDocuments([
      new Document({ pageContent: text }),
    ]);

    console.log("First 5 objects in docs :", docs.slice(0, 5));

    console.log("Split into :", docs.length, "chunks");

    const embeddings = (await embedder.embedDocuments(docs.map((doc) => doc.pageContent)));
    const records = await docs.map((doc, i) => {
      return {
        id: i.toString(),
        values: embeddings[i],
        metadata: {
          content: doc.pageContent,
        },
      };
    });
    
    console.log("Number of Records :", records.length);

    const res = await this.pinecone.createIndex({
      metric: "cosine",
      name: objKey,
      dimension: 1536,
      waitUntilReady: true,
    });

    console.log("Index created", res);

    await this.pinecone.Index(objKey).upsert(records)

    console.log(JSON.stringify(await this.pinecone.describeIndex(objKey)));
    console.log("Index created", objKey);
    return true;
  }

  /**
   * returns true if the embedding was deleted successfully
   * @param objKey 
   * @returns 
   */
  async deleteEmbedding(objKey: string) : Promise<boolean> {
    return this.pinecone.deleteIndex(objKey).then(() => {
      console.log('Index deleted', objKey);
      return true;
    }).catch((err) => {
      console.error('Error deleting index', err);
      return false;
    });
  }

  async generateText(
    prompt: string,
    user: User,
    versionId: string,
    previousConversation: BaseMessage[],
    callback: (text: string, seq: number) => void,
  ): Promise<string> {
    console.log('Generating text for ' + JSON.stringify(user) + ' with prompt: ' + prompt);

    if (prompt === undefined) throw new Error('@lang-chain.service.ts: Parameter prompt is undefined');

    let fullText = '';

    // Create the request for the OpenAI API, based on the appropriate options

    // Start the stream
    let seq = 0;
    await this.chat4.call(
      [new SystemMessage(
        `You are MakeItAiFor.Me, a documents processing AI chatbot, eager to help, and with a mildly enthusiastic attitude. You answer questions with zeal and very very rarely emojis in approprioate contexts. You NEVER comproimize on the quality and accuracy and professional, formal presentation of your answers.
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
      ...previousConversation,
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
    await this.mongoService.saveGeneratedText(fullText, versionId);
    console.log('Text saved to MongoDB. Size:', getSizeInKB(fullText), 'KB');

    return fullText;
  }

  async setTitle(
    query: string,
    response: string,
    chatId: string,
    callback: (text: string) => void,
  ): Promise<string> {
    let title = '';
    await this.chat3.call(
      [
        new SystemMessage(
          'You generate the title for the chat using the query and response. The title should be a maximum of 3 words. You can use the following words: ' + query + ' ' + response,
        ),
        new HumanMessage(`Generate a title for the following chat using this query and response pair. : 
        Query: ${query}
        Response: ${response}`)
      ],
      {
        callbacks: [{
          handleLLMNewToken(token: string) {
            title += token;
          },
        }]
      }
    );

    // Once finished, save the title in MongoDB
    await this.mongoService.saveGeneratedTitle(title, chatId);
    callback(title);
    return title;
  }
}

// return the size of a string in KB, rounded to 2 decimal places
const getSizeInKB = (str: string) => {
  return Math.round(Buffer.byteLength(str, 'utf8') / 1024 * 100) / 100;
}
