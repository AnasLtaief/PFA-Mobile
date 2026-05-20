import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import Ride from '../models/Ride.js';
import Report from '../models/Report.js';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRides = await Ride.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'PENDING' });

    // Calculate total revenue from PAID bookings
    const paidBookings = await Booking.find({ paymentStatus: 'PAID' }).populate({
      path: 'rideId',
      select: 'pricePerSeat',
    });

    let totalRevenue = 0;
    for (const booking of paidBookings) {
      if (booking.rideId) {
        totalRevenue += (booking.rideId as any).pricePerSeat * booking.seats;
      }
    }

    sendSuccess(res, {
      totalUsers,
      totalRides,
      totalRevenue,
      pendingReports,
    }, 'Admin dashboard stats retrieved');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { wilaya, university, role, status, page = 1, limit = 20 } = req.query;
    const query: any = {};

    if (wilaya) query.wilaya = wilaya;
    if (university) query.university = { $regex: university as string, $options: 'i' };
    if (role) query.role = role;

    if (status) {
      if (status === 'banned') query.isBanned = true;
      if (status === 'verified') query.isVerified = true;
      if (status === 'host') query.isHost = true;
    }

    const skipCount = (Number(page) - 1) * Number(limit);
    const users = await User.find(query)
      .select('+phone')
      .skip(skipCount)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    sendSuccess(res, { users, total, page: Number(page), limit: Number(limit) }, 'Users list retrieved');
  } catch (error) {
    next(error);
  }
};

export const banUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    user.isBanned = true;
    await user.save();

    sendSuccess(res, user, 'User banned successfully');
  } catch (error) {
    next(error);
  }
};

export const unbanUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    user.isBanned = false;
    await user.save();

    sendSuccess(res, user, 'User unbanned successfully');
  } catch (error) {
    next(error);
  }
};

export const verifyHost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hostId = req.params.id;

    const user = await User.findById(hostId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    user.isVerified = true;
    await user.save();

    // Verify car as well
    const car = await Car.findOne({ userId: hostId });
    if (car) {
      car.isVerified = true;
      await car.save();
    }

    sendSuccess(res, { user, car }, 'Host and vehicle verified successfully');
  } catch (error) {
    next(error);
  }
};

export const getRides = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, wilaya, page = 1, limit = 20 } = req.query;
    const query: any = {};

    if (status) query.status = status;
    if (wilaya) query.wilaya = wilaya;

    const skipCount = (Number(page) - 1) * Number(limit);
    const rides = await Ride.find(query)
      .populate('hostId', 'fullName email avatarUrl university')
      .populate('carId')
      .skip(skipCount)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Ride.countDocuments(query);

    sendSuccess(res, { rides, total, page: Number(page), limit: Number(limit) }, 'Rides list retrieved');
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skipCount = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find({ stripePaymentIntentId: { $ne: null } })
      .populate('passengerId', 'fullName email avatarUrl')
      .populate({
        path: 'rideId',
        populate: { path: 'hostId', select: 'fullName email stripeAccountId' },
      })
      .skip(skipCount)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments({ stripePaymentIntentId: { $ne: null } });

    sendSuccess(res, { payments: bookings, total, page: Number(page), limit: Number(limit) }, 'Transaction list retrieved');
  } catch (error) {
    next(error);
  }
};
