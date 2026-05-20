import { Schema, model, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  _id: Types.ObjectId;
  rideId: Types.ObjectId;
  passengerId: Types.ObjectId;
  seats: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED' | 'CASH';
  stripePaymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    rideId: {
      type: Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
    },
    passengerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seats: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'REFUNDED', 'CASH'],
      default: 'PENDING',
    },
    stripePaymentIntentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = model<IBooking>('Booking', bookingSchema);
export default Booking;
