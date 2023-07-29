import { Server } from 'socket.io';
export declare class LangChainGateway {
    server: Server;
    handleMessage(client: any, payload: any): string;
    buttonClicked(client: any, payload: any): string;
}
