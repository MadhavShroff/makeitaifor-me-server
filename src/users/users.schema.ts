import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Provider } from '../types/user';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class User extends Document {
  @Field()
  @Prop({ required: true })
  provider: Provider;

  @Field()
  @Prop({ required: true })
  providerId: string;

  @Field()
  @Prop({ required: true, index: true, unique: true })
  email: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ default: Date.now })
  created_at: Date;

  @Field()
  @Prop({ default: Date.now })
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
