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
  @Prop({ type: Number, required: true })
  versionNumber: number;
}

export const MessageVersionSchema =
  SchemaFactory.createForClass(MessageVersion);

@Schema()
export class Message extends Document {
  @Prop({ type: [MessageVersionSchema], default: [] })
  versions: MessageVersion[];

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  previousMessage: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

@Schema()
export class Chat extends Document {
  @Prop({ type: [MessageSchema], default: [] })
  messages: Message[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
