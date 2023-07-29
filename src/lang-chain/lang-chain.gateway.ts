import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class LangChainGateway {
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
