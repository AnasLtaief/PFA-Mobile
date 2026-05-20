import { Schema, model, Document, Types } from 'mongoose';

export interface IGroup extends Document {
  _id: Types.ObjectId;
  name: string;
  wilaya?: string;
  coverPhoto?: string;
  description?: string;
  createdBy?: Types.ObjectId;
  members: Types.ObjectId[];
  admins: Types.ObjectId[];
  pinnedRide?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
    },
    wilaya: {
      type: String,
    },
    coverPhoto: {
      type: String,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    pinnedRide: {
      type: Schema.Types.ObjectId,
      ref: 'Ride',
    },
  },
  {
    timestamps: true,
  }
);

export const Group = model<IGroup>('Group', groupSchema);
export default Group;
