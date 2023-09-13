import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, FilterQuery } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  /**
   * @param userId
   * @returns User object having the given userId
   */
  async findUserByUserId(userId: string): Promise<User> {
    return this.userModel.findOne({ userId: userId }).exec();
  }

  findOne(params: FilterQuery<User & Document>): Promise<User> {
    return this.userModel.findOne(params).exec();
  }

  findAll(params: FilterQuery<User & Document> = {}): Promise<User[]> {
    return this.userModel.find(params).exec();
  }
}
