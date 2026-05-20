import { Schema, model, Document, Types } from 'mongoose';

export interface IMoment extends Document {
  _id: Types.ObjectId;
  rideId: Types.ObjectId;
  userId: Types.ObjectId;
  mediaUrl?: string;
  caption?: string;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const momentSchema = new Schema<IMoment>(
  {
    rideId: {
      type: Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mediaUrl: {
      type: String,
    },
    caption: {
      type: String,
      maxlength: 500,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Moment = model<IMoment>('Moment', momentSchema);
export default Moment;
