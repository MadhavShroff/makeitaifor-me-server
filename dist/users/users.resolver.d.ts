import { UsersService } from './users.service';
import { User } from './users.schema';
export declare class UsersResolver {
    private usersService;
    constructor(usersService: UsersService);
    users(): Promise<User[]>;
}
