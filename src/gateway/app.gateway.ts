import { UseGuards } from '@nestjs/common';
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
import { User } from 'src/types/user';

@UseGuards(WsJwtAuthGuard)
@WebSocketGateway({
  cors: {
    origin: 'https://www.makeitaifor.me',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private langChainService: LangChainService,
    private jwtService: JwtAuthService,
  ) {}

  afterInit() {
    console.log('Initialized Gateway!');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(
      `Client connected: ${client.id} + ${JSON.stringify(
        client.handshake.query,
      )}`,
    );
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
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
    );
    return { event: 'textGenerated', data: result };
  }
}
