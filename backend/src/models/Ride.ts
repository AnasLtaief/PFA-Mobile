import { Schema, model, Document, Types } from 'mongoose';

interface IGeoPoint {
  type: 'Point';
  coordinates: number[];
}

interface ILocation {
  name?: string;
  coordinates?: IGeoPoint;
}

interface IRoutePoint {
  lat: number;
  lng: number;
}

export interface IRide extends Document {
  _id: Types.ObjectId;
  hostId: Types.ObjectId;
  carId?: Types.ObjectId;
  origin: ILocation;
  destination: ILocation;
  wilaya?: string;
  departureTime: Date;
  pricePerSeat: number;
  availableSeats: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  paymentType?: 'CASH' | 'CARD';
  route: IRoutePoint[];
  createdAt: Date;
  updatedAt: Date;
}

const geoPointSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
    },
  },
  { _id: false }
);

const locationSchema = new Schema(
  {
    name: { type: String },
    coordinates: { type: geoPointSchema },
  },
  { _id: false }
);

const routePointSchema = new Schema(
  {
    lat: { type: Number },
    lng: { type: Number },
  },
  { _id: false }
);

const rideSchema = new Schema<IRide>(
  {
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    carId: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
    },
    origin: {
      type: locationSchema,
    },
    destination: {
      type: locationSchema,
    },
    wilaya: {
      type: String,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    pricePerSeat: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    paymentType: {
      type: String,
      enum: ['CASH', 'CARD'],
    },
    route: {
      type: [routePointSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

rideSchema.index({ wilaya: 1, departureTime: 1 });
rideSchema.index({ hostId: 1 });
rideSchema.index({ status: 1 });
rideSchema.index({ 'origin.coordinates': '2dsphere' });
rideSchema.index({ 'destination.coordinates': '2dsphere' });

export const Ride = model<IRide>('Ride', rideSchema);
export default Ride;
