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

  // Inside AppGateway class

  // Remove the code inside the constructor
  constructor(
    private langChainService: LangChainService,
    private jwtService: JwtAuthService,
  ) {}

  // Add the middleware inside afterInit method
  afterInit(server: Server) {
    console.log('Initialized Gateway!');
    this.server.use(async (socket: Socket, next) => {
      const token = socket.handshake.query.token as string;
      try {
        const payload = this.jwtService.verifyToken(token);
        (socket.client as any).user = payload;
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });
  }

  handleConnection(client, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    // const user = args[0].user; // get the user data from the request
    // console.log(`Client connected: ${JSON.stringify(user)}}`);
    // attach the user data to the client for later use
    // client.user = user;
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
