import { Request, Response, NextFunction } from 'express';
import Story from '../models/Story.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { uploadFile } from '../services/storage.js';

export const createStory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { caption, mediaType } = req.body;
    const file = req.file;

    if (!file) {
      sendError(res, 'Media file is required', 400);
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    const path = `stories/${userId}_${Date.now()}_${file.originalname}`;
    const mediaUrl = await uploadFile('media', path, file.buffer, file.mimetype);

    // story expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await Story.create({
      userId,
      mediaUrl,
      mediaType,
      caption,
      expiresAt,
    });

    sendSuccess(res, story, 'Story created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getStories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    const userFriends = user.friends || [];
    const userWilaya = user.wilaya;

    // Get unexpired stories from user, their friends, or users from the same wilaya
    // ExpiresAt > now
    const now = new Date();
    const query: any = {
      expiresAt: { $gt: now },
      $or: [
        { userId: userId },
        { userId: { $in: userFriends } },
      ],
    };

    // If user has a wilaya, match users from the same wilaya as well
    if (userWilaya) {
      const sameWilayaUserIds = await User.find({ wilaya: userWilaya, isBanned: false }).select('_id');
      const idArray = sameWilayaUserIds.map((u) => u._id);
      query.$or.push({ userId: { $in: idArray } });
    }

    const stories = await Story.find(query)
      .populate('userId', 'fullName email avatarUrl university')
      .sort({ createdAt: -1 });

    sendSuccess(res, stories, 'Stories retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const viewStory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const viewerId = req.user?.userId;
    const storyId = req.params.id;

    const story = await Story.findById(storyId);
    if (!story) {
      sendError(res, 'Story not found or expired', 404);
      return;
    }

    // Add view if not already viewed by this user
    const alreadyViewed = story.views.some((view) => view.userId.toString() === viewerId);
    if (!alreadyViewed && story.userId.toString() !== viewerId) {
      story.views.push({
        userId: viewerId as any,
        viewedAt: new Date(),
      });
      await story.save();
    }

    sendSuccess(res, story, 'Story view registered');
  } catch (error) {
    next(error);
  }
};

export const deleteStory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const storyId = req.params.id;

    const story = await Story.findById(storyId);
    if (!story) {
      sendError(res, 'Story not found', 404);
      return;
    }

    if (story.userId.toString() !== userId) {
      sendError(res, 'Unauthorized to delete this story', 403);
      return;
    }

    await Story.deleteOne({ _id: storyId });

    sendSuccess(res, null, 'Story deleted successfully');
  } catch (error) {
    next(error);
  }
};
