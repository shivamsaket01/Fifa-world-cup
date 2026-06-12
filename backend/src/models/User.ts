import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin' | 'superadmin';
  avatar?: string;
  favoriteTeam?: mongoose.Types.ObjectId;
  points: number;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false }, // Prevent password from being returned by default
  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
  avatar: { type: String },
  favoriteTeam: { type: Schema.Types.ObjectId, ref: 'Team' },
  points: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
