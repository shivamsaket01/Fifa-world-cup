import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  author: string;
  date: Date;
}

const NewsSchema: Schema = new Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<INews>('News', NewsSchema);
