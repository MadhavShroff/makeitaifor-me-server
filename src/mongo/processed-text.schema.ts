import { Schema } from 'mongoose';

export const ProcessedTextSchema = new Schema({
  userId: String,
  text: String,
  Key: String,
  timestamp: { type: Date, default: Date.now },
});
