import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin' | 'superadmin';
  avatar?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false }, // Prevent password from being returned by default
  role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
  avatar: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
