import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { LangChainService } from 'src/lang-chain/lang-chain.service';
import { User } from 'src/types/user';

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

  afterInit(server: any) {
    console.log('Initialized Gateway!');
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log(
      `Client connected: ${client.id} + ${JSON.stringify(
        client.handshake.query,
      )}`,
    );
    const token = client.handshake.query.token as string;
    console.log('Token: ', token);
    try {
      const payload = this.jwtService.verifyToken(token);
      (client as any).user = payload;
    } catch (err) {
      console.error('Authentication error', err);
      // TODO: User is trying to start a chat but is not able to, since they are not authenticated.
      // TODO: We should send a message to the client to let them know that they are not authenticated, and start a guest session.
      client.disconnect(true); // disconnect the client if token verification fails
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): string {
    console.log('Received message: ', message);
    return `Received at 'message', you sent: ${message}`;
  }

  @SubscribeMessage('buttonClicked')
  buttonClicked(@MessageBody() data: any): string {
    console.log('Received event at buttonClicked with data: ', data);
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
