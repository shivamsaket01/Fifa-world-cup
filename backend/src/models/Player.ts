import mongoose, { Document, Schema } from 'mongoose';

export interface IPlayer extends Document {
  name: string;
  team: mongoose.Types.ObjectId;
  position: string;
  number: number;
  goals: number;
}

const PlayerSchema: Schema = new Schema({
  name: { type: String, required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  position: { type: String, required: true },
  number: { type: Number, required: true },
  goals: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IPlayer>('Player', PlayerSchema);
