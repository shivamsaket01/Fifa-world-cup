import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  code: string;
  logo: string;
  group: string;
  coach: string;
}

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  logo: { type: String, required: true },
  group: { type: String, required: true },
  coach: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<ITeam>('Team', TeamSchema);
