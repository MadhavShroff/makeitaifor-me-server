import { Model, Document, FilterQuery } from 'mongoose';
import { User } from './users.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    create(user: User): Promise<User>;
    findOne(params: FilterQuery<User & Document>): Promise<User>;
    findAll(params?: FilterQuery<User & Document>): Promise<User[]>;
}
