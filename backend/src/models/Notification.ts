import { Schema, model, Document, Types } from 'mongoose';

export type NotificationType =
  | 'BOOKING_REQUEST'
  | 'BOOKING_ACCEPTED'
  | 'BOOKING_REJECTED'
  | 'RIDE_STARTING'
  | 'RIDE_COMPLETED'
  | 'NEW_MESSAGE'
  | 'FRIEND_REQUEST'
  | 'STORY_VIEW'
  | 'MOMENT_LIKE'
  | 'MOMENT_CAMERA'
  | 'SOS_ALERT'
  | 'REPORT_UPDATE';

export interface INotification extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  body?: string;
  isRead: boolean;
  data?: Map<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'BOOKING_REQUEST',
        'BOOKING_ACCEPTED',
        'BOOKING_REJECTED',
        'RIDE_STARTING',
        'RIDE_COMPLETED',
        'NEW_MESSAGE',
        'FRIEND_REQUEST',
        'STORY_VIEW',
        'MOMENT_LIKE',
        'MOMENT_CAMERA',
        'SOS_ALERT',
        'REPORT_UPDATE',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ userId: 1, isRead: 1 });

export const Notification = model<INotification>('Notification', notificationSchema);
export default Notification;
