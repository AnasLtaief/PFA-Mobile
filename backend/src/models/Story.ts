import { Schema, model, Document, Types } from 'mongoose';

interface IStoryView {
  userId: Types.ObjectId;
  viewedAt: Date;
}

export interface IStory extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  caption?: string;
  expiresAt: Date;
  views: IStoryView[];
  createdAt: Date;
  updatedAt: Date;
}

const storyViewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const storySchema = new Schema<IStory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['IMAGE', 'VIDEO'],
      required: true,
    },
    caption: {
      type: String,
      maxlength: 500,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    views: {
      type: [storyViewSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Story = model<IStory>('Story', storySchema);
export default Story;
