import { Request, Response, NextFunction } from 'express';
import Moment from '../models/Moment.js';
import Ride from '../models/Ride.js';
import Booking from '../models/Booking.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { uploadFile } from '../services/storage.js';

export const createMoment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { rideId, caption } = req.body;
    const file = req.file;

    if (!file) {
      sendError(res, 'Media file is required for a moment', 400);
      return;
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      sendError(res, 'Ride not found', 404);
      return;
    }

    // Verify user participated in the ride (host or passenger with accepted booking)
    const isHost = ride.hostId.toString() === userId;
    const booking = await Booking.findOne({ rideId, passengerId: userId, status: 'ACCEPTED' });

    if (!isHost && !booking) {
      sendError(res, 'You must be a participant of the ride to post a moment', 403);
      return;
    }

    const path = `moments/${rideId}_${userId}_${Date.now()}_${file.originalname}`;
    const mediaUrl = await uploadFile('media', path, file.buffer, file.mimetype);

    const moment = await Moment.create({
      rideId,
      userId,
      mediaUrl,
      caption,
      likes: [],
    });

    sendSuccess(res, moment, 'Moment snapped successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getMomentsByRide = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rideId = req.params.rideId;

    const moments = await Moment.find({ rideId })
      .populate('userId', 'fullName email avatarUrl university')
      .sort({ createdAt: -1 });

    sendSuccess(res, moments, 'Ride moments retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const toggleLikeMoment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const momentId = req.params.id;

    const moment = await Moment.findById(momentId);
    if (!moment) {
      sendError(res, 'Moment not found', 404);
      return;
    }

    const index = moment.likes.findIndex((id) => id.toString() === userId);
    if (index === -1) {
      // Like
      moment.likes.push(userId as any);
    } else {
      // Unlike
      moment.likes.splice(index, 1);
    }

    await moment.save();
    sendSuccess(res, moment, 'Moment like updated');
  } catch (error) {
    next(error);
  }
};

export const deleteMoment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const momentId = req.params.id;

    const moment = await Moment.findById(momentId);
    if (!moment) {
      sendError(res, 'Moment not found', 404);
      return;
    }

    if (moment.userId.toString() !== userId) {
      sendError(res, 'Unauthorized to delete this moment', 403);
      return;
    }

    await Moment.deleteOne({ _id: momentId });
    sendSuccess(res, null, 'Moment deleted successfully');
  } catch (error) {
    next(error);
  }
};
