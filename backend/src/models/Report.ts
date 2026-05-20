import { Schema, model, Document, Types } from 'mongoose';

export interface IReport extends Document {
  _id: Types.ObjectId;
  reporterId: Types.ObjectId;
  reportedUserId: Types.ObjectId;
  rideId?: Types.ObjectId;
  reason: 'UNSAFE_DRIVING' | 'HARASSMENT' | 'FRAUD' | 'FAKE_PROFILE' | 'OTHER';
  description?: string;
  evidencePhotos: string[];
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  adminNote?: string;
  resolvedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rideId: {
      type: Schema.Types.ObjectId,
      ref: 'Ride',
    },
    reason: {
      type: String,
      enum: ['UNSAFE_DRIVING', 'HARASSMENT', 'FRAUD', 'FAKE_PROFILE', 'OTHER'],
      required: true,
    },
    description: {
      type: String,
    },
    evidencePhotos: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'],
      default: 'PENDING',
    },
    adminNote: {
      type: String,
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ status: 1 });

export const Report = model<IReport>('Report', reportSchema);
export default Report;
