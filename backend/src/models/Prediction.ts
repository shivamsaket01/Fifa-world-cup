import mongoose, { Document, Schema } from 'mongoose';

export interface IPrediction extends Document {
  user: mongoose.Types.ObjectId;
  match: mongoose.Types.ObjectId;
  homeScore: number;
  awayScore: number;
  pointsAwarded?: number;
  createdAt: Date;
}

const PredictionSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  match: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
  homeScore: { type: Number, required: true },
  awayScore: { type: Number, required: true },
  pointsAwarded: { type: Number, default: null }, // Null means match hasn't finished yet
}, { timestamps: true });

// A user can only predict a match once
PredictionSchema.index({ user: 1, match: 1 }, { unique: true });

export default mongoose.model<IPrediction>('Prediction', PredictionSchema);
