import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/socket.io',
  cors: {
    origin: 'https://www.makeitaifor.me',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class LangChainGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('received event at message with data: ', payload);
    return `Received your message: ${payload}`;
  }

  @SubscribeMessage('buttonClicked')
  buttonClicked(client: any, payload: any): string {
    console.log('received event at buttonClicked with data: ', payload);
    return 'Acknowledged button click!';
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }
}
