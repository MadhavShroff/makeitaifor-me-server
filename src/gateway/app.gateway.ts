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
import { Server, Socket } from 'socket.io';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { WsJwtAuthGuard } from 'src/gateway/ws-jwt/ws-jwt.guard';
import { LangChainService } from 'src/lang-chain/lang-chain.service';
import { User } from 'src/types';

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
}
