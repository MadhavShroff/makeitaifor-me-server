import { Model, Document, FilterQuery } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './users.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    create(user: CreateUserDto): Promise<User>;
    findOne(params: FilterQuery<User & Document>): Promise<User>;
    findAll(params?: FilterQuery<User & Document>): Promise<User[]>;
}
