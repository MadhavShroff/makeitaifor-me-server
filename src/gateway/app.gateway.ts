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

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket & { user: User },
  ): string {
    console.log('Received message: ', message);
    console.log('User: ', client.user);
    return `Received at 'message', you sent: ${message}`;
  }

  @SubscribeMessage('buttonClicked')
  buttonClicked(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket & { user: User },
  ): string {
    console.log('Received event at buttonClicked with data: ', data);
    console.log('User: ', client.user);
    return 'Acknowledged button click! : ' + data;
  }

  @SubscribeMessage('tryButtonClicked')
  async tryButtonClicked(
    @MessageBody() data: { content: string },
    @ConnectedSocket() client: Socket & { user: User },
  ): Promise<WsResponse<string>> {
    console.log('Received event at tryButtonClicked with data: ', data);
    const result = await this.langChainService.generateText(
      data.content,
      client.user,
      (str: string, seq: number) => {
        client.emit('textGeneratedChunk', {
          event: 'textGeneratedChunk',
          data: str,
          seq: seq,
        });
      },
    );
    return { event: 'textGenerated', data: result };
  }

  @SubscribeMessage('generateText')
  async generateText(
    @MessageBody() data: { query: string; ext: string },
    @ConnectedSocket() client: Socket & { user: User },
  ): Promise<WsResponse<string>> {
    console.log('Received event at tryButtonClicked with data: ', data);
    const result = await this.langChainService.generateText(
      data.query,
      client.user,
      (str: string, seq: number) => {
        client.emit('textGeneratedChunk-' + data.ext, {
          event: 'textGeneratedChunk',
          data: str,
          seq: seq,
        });
      },
    );
    return { event: 'textGenerated-' + data.ext, data: result };
  }

  @SubscribeMessage('messageSubmitted')
  async messageSubmitted(
    @MessageBody() data: { content: string; chatId: string },
    @ConnectedSocket() client: Socket & { user: User },
  ) {
    const newQueryMessage = await this.chatsService.createMessage({
      text: data.content,
      type: 'user',
      isActive: true,
      createdAt: new Date(),
      versionNumber: 1,
    } as MessageVersion);

    const newResponseMessage = await this.chatsService.createMessage({
      text: ' ',
      type: 'ai',
      isActive: true,
      createdAt: new Date(),
      versionNumber: 1,
    } as MessageVersion);

    const chatIdGuestOrNot =
      data.chatId === '123'
        ? new Types.ObjectId(123)
        : new Types.ObjectId(data.chatId);
    // TODO : replace this hacky code
    await Promise.all([
      this.chatsService.appendMessageToChat(
        newQueryMessage._id,
        chatIdGuestOrNot,
      ),
      this.chatsService.appendMessageToChat(
        newResponseMessage._id,
        chatIdGuestOrNot,
      ),
    ]).then((values) => {
      console.log('values: ', values);
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

  @SubscribeMessage('startEmptyChat')
  async startEmptyChat(
    @ConnectedSocket() client: Socket & { user: User },
  ): Promise<
    WsResponse<{
      status: string;
      updatedUser: User;
    }>
  > {
    console.log('Received event at startEmptyChat');
    const user = await this.chatsService.addChatToUser(
      client.user.id,
      (
        await this.chatsService.createTempChat()
      )._id,
    ); // Create a new empty chat object
    console.log('Updated User Object: ', user);
    return {
      event: 'emptyChatStarted',
      data: {
        status: 'success',
        updatedUser: user,
      },
    };
  }
}
