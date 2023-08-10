import { Schema } from 'mongoose';

export const GeneratedTextSchema = new Schema({
  userId: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});
