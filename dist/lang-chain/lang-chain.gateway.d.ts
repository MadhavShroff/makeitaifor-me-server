import { OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class LangChainGateway implements OnGatewayConnection {
    server: Server;
    handleMessage(client: any, payload: any): string;
    buttonClicked(client: any, payload: any): string;
    handleConnection(client: Socket, ...args: any[]): void;
}
