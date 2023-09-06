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
  async generateText(
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

  @SubscribeMessage('startNewChat')
  async startNewChat(
    @MessageBody() data: { firstQuery: string },
    @ConnectedSocket() client: Socket & { user: User },
  ): Promise<WsResponse<string>> {
    console.log('Received event at startNewChat with data: ', data);
    const chat = await this.chatsService.createChat(client.user.id); // Create a new empty chat object
    // Create the first message version
    const firstMessageVersion = {
      text: data.firstQuery,
      type: 'text', // Adjust type as needed
      isActive: true,
      createdAt: new Date(),
      versionNumber: 1,
    };

    // Append the first message to the chat
    await this.chatsService.appendMessage(
      chat._id,
      firstMessageVersion as MessageVersion,
    );

    return { event: 'newChatStarted', data: 'New chat has been started!' };
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
      ).chatId,
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

  @SubscribeMessage('chatSubmitted')
  async chatSubmitted(
    @MessageBody() data: { chatId: string; content: string },
    @ConnectedSocket() client: Socket & { user: User },
  ): Promise<WsResponse<string>> {
    console.log('Received event at chatSubmitted', data);
    const firstMessageVersion = {
      text: data.content,
      type: 'user', // Adjust type as needed
      isActive: true,
      createdAt: new Date(),
      versionNumber: 1,
    };

    // Append the first message to the chat
    await this.chatsService.appendMessage(
      new Types.ObjectId(data.chatId),
      firstMessageVersion as MessageVersion,
    );

    return {
      event: 'chatSubmitted',
      data: `Chat ID: New message: ${data.content} received at ${data.chatId} has been saved!`,
    };
  }

  // This subscription appends a query message to an existing chat
  @SubscribeMessage('appendQueryToChat')
  async appendQueryToChat(
    @MessageBody()
    data: {
      query: string;
      userId: Types.ObjectId;
      chatId: Types.ObjectId;
      predecessor?: Types.ObjectId;
    },
    @ConnectedSocket() client: Socket & { user: User },
  ): Promise<WsResponse<string>> {
    // Assuming data.userId matches with client.user.id for security reasons
    if (data.userId.toString() !== client.user.id) {
      return { event: 'error', data: 'User ID mismatch!' };
    }

    const queryVersion = {
      text: data.query,
      type: 'query',
      isActive: true,
      createdAt: new Date(),
      versionNumber: 1, // This should be incremented based on existing versions but for simplicity, set as 1
    };

    const updatedChat = await this.chatsService.appendMessage(
      data.chatId,
      queryVersion as MessageVersion,
    );
    if (data.predecessor) {
      // Handle predecessor linking logic here, if needed
    }

    return {
      event: 'queryAppended',
      data: `Query has been appended to chat ID: ${updatedChat._id}`,
    };
  }
}
