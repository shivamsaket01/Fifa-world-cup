import mongoose, { Document, Schema } from 'mongoose';

export interface IStanding extends Document {
  team: mongoose.Types.ObjectId;
  group: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

const StandingSchema: Schema = new Schema({
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  group: { type: String, required: true },
  played: { type: Number, default: 0 },
  won: { type: Number, default: 0 },
  drawn: { type: Number, default: 0 },
  lost: { type: Number, default: 0 },
  goalsFor: { type: Number, default: 0 },
  goalsAgainst: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IStanding>('Standing', StandingSchema);
