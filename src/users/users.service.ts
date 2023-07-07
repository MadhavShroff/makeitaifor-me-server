import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, FilterQuery } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User & Document>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  findOne(params: FilterQuery<User & Document>): Promise<User> {
    console.log('params received in findOne: ', params);
    return this.userModel.findOne(params).exec();
  }

  findAll(params: FilterQuery<User & Document> = {}): Promise<User[]> {
    return this.userModel.find(params).exec();
  }
}
