import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { LangChainService } from 'src/lang-chain/lang-chain.service';
import { User } from 'src/types/user';
export declare class AppGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private langChainService;
    private jwtService;
    server: Server;
    constructor(langChainService: LangChainService, jwtService: JwtAuthService);
    afterInit(): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleMessage(message: string, client: Socket & {
        user: User;
    }): string;
    buttonClicked(data: any, client: Socket & {
        user: User;
    }): string;
    generateText(data: {
        content: string;
    }, client: Socket & {
        user: User;
    }): Promise<WsResponse<string>>;
}
