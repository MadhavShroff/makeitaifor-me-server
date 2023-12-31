import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { WsJwtAuthGuard } from 'src/gateway/ws-jwt/ws-jwt.guard';
import { LangChainService } from 'src/lang-chain/lang-chain.service';
import { MessageVersion } from 'src/mongo/chats/chat.schema';
import { ChatsService } from 'src/mongo/chats/chats.service';
import { User } from 'src/mongo/users/users.schema';

const opts = {
  cors:
    process.env.APP_ENV === 'production'
      ? {
          origin: ['https://www.makeitaifor.me'],
          methods: ['GET', 'POST'],
          credentials: true,
        }
      : {
          origin: ['http://localhost:3001'],
          methods: ['GET', 'POST'],
        },
};

@UseGuards(WsJwtAuthGuard)
@WebSocketGateway(opts)
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private langChainService: LangChainService,
    private jwtService: JwtAuthService,
    private configService: ConfigService,
    private chatsService: ChatsService,
  ) {}

  afterInit() {
    // print webSocketGateway options
    // console.log('WebSocketGateway options: ' + JSON.stringify(opts));
    // console.log('Initialized Gateway!');
  }

  handleConnection(@ConnectedSocket() client: Socket & { user: User }) {
    // console.log(
    //   `Client connected: ${client.user} + ${JSON.stringify(
    //     client.handshake.query,
    //   )}`,
    // );
    // TODO: update last visited metadata
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    // console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('generateText')
  async generateText(
    @MessageBody() data: { query: string; chatId: string; versionId: string },
    @ConnectedSocket() client: Socket & { user: User },
  ): Promise<WsResponse<string>> {
    if (data.chatId === undefined) throw new Error('chatId is undefined');
    if (data.query === undefined) throw new Error('query is undefined');
    if (data.versionId === undefined) throw new Error('versionId is undefined');

    console.log('Received event at generateText with data: ', data);
    const previousConversation = await this.chatsService.getActiveMessages(
      data.chatId,
    );
    const fullGeneratedText = await this.langChainService.generateText(
      data.query,
      client.user,
      data.versionId,
      previousConversation,
      (str: string, seq: number) => {
        client.emit('textGeneratedChunk-' + data.chatId, {
          event: 'textGeneratedChunk',
          data: str,
          seq: seq,
        });
      },
    );
    // if this chat does not have a title, get a title, and set it
    const hasTitle = await this.chatsService.isDefaultTitleForChat(data.chatId);
    if (hasTitle) {
      await this.langChainService.setTitle(
        data.query,
        fullGeneratedText,
        data.chatId,
        (str: string) => {
          client.emit('titleGenerated-' + data.chatId, {
            event: 'titleGenerated',
            title: str,
          });
        },
      );
    }
    return { event: 'textGenerated-' + data.chatId, data: fullGeneratedText };
  }

  @SubscribeMessage('messageSubmitted')
  async messageSubmitted(
    @MessageBody() data: { content: string; chatId: string },
    @ConnectedSocket() client: Socket & { user: User },
  ) {
    // TODO: remove this hacky code
    if (data.chatId === '123') {
      client.emit(
        'addedQueryToChat-' + data.chatId,
        JSON.stringify({
          event: 'addedQueryAndResponseToChat-' + data.chatId,
          message: {
            versions: [
              {
                text: data.content,
                type: 'user',
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                versionNumber: 1,
                _id: 123,
                __v: 0,
              },
            ],
            _id: 'abc',
            __v: 0,
          },
        }),
      );
      client.emit(
        'addedResponseToChat-' + data.chatId,
        JSON.stringify({
          event: 'addedQueryAndResponseToChat-' + data.chatId,
          message: {
            versions: [
              {
                text: ' ',
                type: 'ai',
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                versionNumber: 1,
                _id: 234,
                __v: 0,
              },
            ],
            _id: 'def',
            __v: 0,
          },
        }),
      );
      return;
    }
    const newQueryMessage = await this.chatsService.createMessage({
      text: data.content,
      type: 'user',
      isActive: true,
      versionNumber: 1,
    } as MessageVersion);

    const newResponseMessage = await this.chatsService.createMessage({
      text: ' ',
      type: 'ai',
      isActive: true,
      versionNumber: 1,
    } as MessageVersion);

    await Promise.all([
      this.chatsService.appendMessageToChat(
        newQueryMessage._id,
        new Types.ObjectId(data.chatId),
      ),
      this.chatsService.appendMessageToChat(
        newResponseMessage._id,
        new Types.ObjectId(data.chatId),
      ),
    ]).then(() => {
      client.emit(
        'addedQueryToChat-' + data.chatId,
        JSON.stringify({
          event: 'addedQueryAndResponseToChat-' + data.chatId,
          message: newQueryMessage.$clone(),
        }),
      );
      client.emit(
        'addedResponseToChat-' + data.chatId,
        JSON.stringify({
          event: 'addedQueryAndResponseToChat-' + data.chatId,
          message: newResponseMessage.$clone(),
        }),
      );
    });
  }
}
