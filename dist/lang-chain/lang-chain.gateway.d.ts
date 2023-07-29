import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class LangChainGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    server: Server;
    afterInit(server: any): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleMessage(message: string): string;
    buttonClicked(data: any): string;
}
