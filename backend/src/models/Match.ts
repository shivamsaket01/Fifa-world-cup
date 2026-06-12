import mongoose, { Document, Schema } from 'mongoose';

export interface IMatch extends Document {
  homeTeam: mongoose.Types.ObjectId;
  awayTeam: mongoose.Types.ObjectId;
  homeScore: number;
  awayScore: number;
  status: string; // 'NS' (Not Started), 'LIVE', 'HT', 'FT'
  time: string; // e.g. '65\'', 'HT'
  date: Date;
  group: string;
}

const MatchSchema: Schema = new Schema({
  homeTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  awayTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  homeScore: { type: Number, default: 0 },
  awayScore: { type: Number, default: 0 },
  status: { type: String, enum: ['NS', 'LIVE', 'HT', 'FT'], default: 'NS' },
  time: { type: String, default: '' },
  date: { type: Date, required: true },
  group: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IMatch>('Match', MatchSchema);
