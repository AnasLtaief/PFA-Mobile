import { Schema, model, Document, Types } from 'mongoose';

interface IReaction {
  userId: Types.ObjectId;
  emoji: string;
}

export interface IGroupMessage extends Document {
  _id: Types.ObjectId;
  groupId: Types.ObjectId;
  senderId: Types.ObjectId;
  content?: string;
  mediaUrl?: string;
  reactions: IReaction[];
  createdAt: Date;
  updatedAt: Date;
}

const reactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    emoji: {
      type: String,
    },
  },
  { _id: false }
);

const groupMessageSchema = new Schema<IGroupMessage>(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
    },
    mediaUrl: {
      type: String,
    },
    reactions: {
      type: [reactionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

groupMessageSchema.index({ groupId: 1, createdAt: -1 });

export const GroupMessage = model<IGroupMessage>('GroupMessage', groupMessageSchema);
export default GroupMessage;
