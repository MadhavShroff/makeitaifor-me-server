import { Types } from 'mongoose';
import { Provider } from 'src/types';
export declare class CreateUserDto {
    provider: Provider;
    id: string;
    email: string;
    name: string;
    username: string;
    chats: Types.ObjectId[];
}
