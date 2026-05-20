import { Schema, model, Document, Types } from 'mongoose';

export interface ICar {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  brand: string;
  model: string;
  year?: number;
  color?: string;
  plateNumber: string;
  seats: number;
  carPhotos: string[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const carSchema = new Schema<ICar>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
    },
    color: {
      type: String,
    },
    plateNumber: {
      type: String,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    carPhotos: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Car = model<ICar>('Car', carSchema);
export default Car;
