import { Model, Document, FilterQuery } from 'mongoose';
import { User } from './users.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    create(user: User): Promise<User>;
    createWithExpiry(user: User, expiryDate: Date): Promise<User>;
    findUserByUserId(userId: string): Promise<User>;
    findOne(params: FilterQuery<User & Document>): Promise<User>;
    findAll(params?: FilterQuery<User & Document>): Promise<User[]>;
}
