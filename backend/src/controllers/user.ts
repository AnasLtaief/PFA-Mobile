import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';
import Booking from '../models/Booking.js';
import Group from '../models/Group.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { uploadFile } from '../services/storage.js';
import crypto from 'crypto';

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId).populate('friends', 'fullName email avatarUrl university wilaya isHost');
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    sendSuccess(res, user, 'User profile retrieved');
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    sendSuccess(res, user, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const file = req.file;

    if (!file) {
      sendError(res, 'Please upload an image file', 400);
      return;
    }

    const path = `avatars/${userId}_${Date.now()}_${file.originalname}`;
    const avatarUrl = await uploadFile('media', path, file.buffer, file.mimetype);

    const user = await User.findByIdAndUpdate(userId, { avatarUrl }, { new: true });
    sendSuccess(res, { avatarUrl, user }, 'Avatar uploaded successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Soft delete: flag as banned/deleted and anonymize sensitive fields
    user.isBanned = true;
    user.fullName = 'Deleted User';
    user.email = `deleted_${crypto.randomBytes(6).toString('hex')}@campuscovoiturage.dz`;
    user.phone = undefined;
    user.avatarUrl = '';
    user.bio = '';
    user.university = '';
    user.wilaya = undefined;
    user.studentIdUrl = '';
    user.stripeAccountId = undefined;
    user.stripeCustomerId = undefined;
    user.emergencyContact = undefined;

    // Remove from all user's friends arrays
    await User.updateMany({ friends: userId }, { $pull: { friends: userId } });
    user.friends = [];

    await user.save();

    // Cancel all user's pending or accepted bookings
    await Booking.updateMany(
      { passengerId: userId, status: { $in: ['PENDING', 'ACCEPTED'] } },
      { status: 'CANCELLED' }
    );

    // Remove from all Group members/admins
    await Group.updateMany({ members: userId }, { $pull: { members: userId } });
    await Group.updateMany({ admins: userId }, { $pull: { admins: userId } });

    res.clearCookie('refreshToken');
    sendSuccess(res, null, 'Account deleted and anonymized successfully');
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('fullName email avatarUrl bio university wilaya isHost isVerified createdAt');
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    sendSuccess(res, user, 'User profile retrieved');
  } catch (error) {
    next(error);
  }
};

export const sendFriendRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const senderId = req.user?.userId;
    const receiverId = req.params.id;

    if (senderId === receiverId) {
      sendError(res, 'You cannot send a friend request to yourself', 400);
      return;
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      sendError(res, 'Receiver user not found', 404);
      return;
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    if (existingRequest) {
      sendError(res, 'Friend request already exists between these users', 400);
      return;
    }

    const friendRequest = await FriendRequest.create({
      senderId,
      receiverId,
      status: 'PENDING',
    });

    sendSuccess(res, friendRequest, 'Friend request sent successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const respondFriendRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const receiverId = req.user?.userId;
    const requestId = req.params.id;
    const { status } = req.body; // ACCEPTED or REJECTED

    const request = await FriendRequest.findById(requestId);
    if (!request || request.receiverId.toString() !== receiverId) {
      sendError(res, 'Friend request not found or unauthorized', 404);
      return;
    }

    if (request.status !== 'PENDING') {
      sendError(res, 'Friend request already responded to', 400);
      return;
    }

    request.status = status;
    await request.save();

    if (status === 'ACCEPTED') {
      // Add each other to friends lists
      await User.findByIdAndUpdate(request.senderId, { $addToSet: { friends: request.receiverId } });
      await User.findByIdAndUpdate(request.receiverId, { $addToSet: { friends: request.senderId } });
    }

    sendSuccess(res, request, `Friend request ${status.toLowerCase()} successfully`);
  } catch (error) {
    next(error);
  }
};

export const getFriends = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId).populate('friends', 'fullName email avatarUrl university wilaya isHost isVerified');
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }
    sendSuccess(res, user.friends, 'Friends list retrieved');
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q, wilaya } = req.query;
    const query: any = { isBanned: false };

    if (q) {
      query.fullName = { $regex: q as string, $options: 'i' };
    }
    if (wilaya) {
      query.wilaya = wilaya;
    }

    const users = await User.find(query)
      .select('fullName email avatarUrl bio university wilaya isHost isVerified')
      .limit(20);

    sendSuccess(res, users, 'Search results');
  } catch (error) {
    next(error);
  }
};
