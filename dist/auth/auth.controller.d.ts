import { JwtAuthService } from './jwt/jwt.service';
import { ChatsService } from 'src/mongo/chats/chats.service';
import { UsersService } from 'src/mongo/users/users.service';
export declare class AuthController {
    private jwtService;
    private chatsService;
    private usersService;
    constructor(jwtService: JwtAuthService, chatsService: ChatsService, usersService: UsersService);
    getWebSocketToken(req: any): {
        token: string;
    };
    getGuestToken(res: any): Promise<void>;
}
