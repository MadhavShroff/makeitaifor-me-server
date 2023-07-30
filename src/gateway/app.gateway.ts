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

  constructor(private langChainService: LangChainService) {}

  afterInit(server: any) {
    console.log('Initialized Gateway!');
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
    const result = await this.langChainService.generateText(
      data.content,
      client.user,
    );
    return { event: 'textGenerated', data: result };
  }
}
