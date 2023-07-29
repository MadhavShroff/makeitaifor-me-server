import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/socket.io',
  cors: {
    origin: 'https://www.makeitaifor.me',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class LangChainGateway {
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('received event at message with data: ', payload);
    return 'Hello world!';
  }

  @SubscribeMessage('buttonClicked')
  buttonClicked(client: any, payload: any): string {
    console.log('received event at buttonClicked with data: ', payload);
    return 'Acknowledged button click!';
  }
}
