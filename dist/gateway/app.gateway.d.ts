import { ConfigService } from '@nestjs/config';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthService } from 'src/auth/jwt/jwt.service';
import { LangChainService } from 'src/lang-chain/lang-chain.service';
import { ChatsService } from 'src/mongo/chats/chats.service';
import { User } from 'src/mongo/users/users.schema';
export declare class AppGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private langChainService;
    private jwtService;
    private configService;
    private chatsService;
    server: Server;
    constructor(langChainService: LangChainService, jwtService: JwtAuthService, configService: ConfigService, chatsService: ChatsService);
    afterInit(): void;
    handleConnection(client: Socket & {
        user: User;
    }): void;
    handleDisconnect(client: Socket): void;
    handleMessage(message: string, client: Socket & {
        user: User;
    }): string;
    buttonClicked(data: any, client: Socket & {
        user: User;
    }): string;
    generateText(data: {
        query: string;
        ext: string;
        versionId: string;
    }, client: Socket & {
        user: User;
    }): Promise<WsResponse<string>>;
    messageSubmitted(data: {
        content: string;
        chatId: string;
    }, client: Socket & {
        user: User;
    }): Promise<void>;
    startEmptyChat(client: Socket & {
        user: User;
    }): Promise<WsResponse<{
        status: string;
        updatedUser: User;
    }>>;
}
