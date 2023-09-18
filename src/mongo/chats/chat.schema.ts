// chat.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class MessageVersion extends Document {
  @Field()
  @Prop({ type: String, required: true })
  text: string;

  @Field()
  @Prop({ type: String, enum: ['user', 'ai'], required: true })
  type: string;

  @Field()
  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field()
  @Prop({ default: Date.now })
  updatedAt: Date;

  @Field()
  @Prop({ type: Number, required: true })
  versionNumber: number;

  @Field()
  @Prop({ type: String })
  docOrCollectionId: string;

  @Field()
  @Prop({ type: String })
  modelUsed: string;
}

export const MessageVersionSchema =
  SchemaFactory.createForClass(MessageVersion);

@Schema()
export class Message extends Document {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'MessageVersion' }] })
  versions: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  previousMessage: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

@Schema()
export class Chat extends Document {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
  messages: Types.ObjectId[];

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
