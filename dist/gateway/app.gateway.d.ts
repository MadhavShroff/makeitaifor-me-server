import { ConfigService } from '@nestjs/config';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WsResponse } from '@nestjs/websockets';
import { Types } from 'mongoose';
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
        content: string;
    }, client: Socket & {
        user: User;
    }): Promise<WsResponse<string>>;
    startNewChat(data: {
        firstQuery: string;
    }, client: Socket & {
        user: User;
    }): Promise<WsResponse<string>>;
    startEmptyChat(client: Socket & {
        user: User;
    }): Promise<WsResponse<{
        status: string;
        updatedUser: User;
    }>>;
    chatSubmitted(data: {
        chatId: string;
        content: string;
    }, client: Socket & {
        user: User;
    }): Promise<WsResponse<string>>;
    appendQueryToChat(data: {
        query: string;
        userId: Types.ObjectId;
        chatId: Types.ObjectId;
        predecessor?: Types.ObjectId;
    }, client: Socket & {
        user: User;
    }): Promise<WsResponse<string>>;
}
