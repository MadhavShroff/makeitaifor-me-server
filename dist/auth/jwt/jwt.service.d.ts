import { JwtService } from '@nestjs/jwt';
import { User } from '../../types/user';
export default class JwtAuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    login(user: User): {
        accessToken: string;
    };
}
