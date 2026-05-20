import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import Car from '../models/Car.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { uploadFile } from '../services/storage.js';

export const becomeHost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    if (user.isHost) {
      sendError(res, 'User is already a host', 400);
      return;
    }

    // Stripe Express Account setup could be integrated here. For dev we mock it.
    user.isHost = true;
    user.stripeAccountId = `acct_mock_${Date.now()}`;
    await user.save();

    sendSuccess(res, user, 'You are now a registered host');
  } catch (error) {
    next(error);
  }
};

export const createCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { brand, model, year, color, plateNumber, seats } = req.body;
    const files = req.files as Express.Multer.File[];

    const user = await User.findById(userId);
    if (!user || !user.isHost) {
      sendError(res, 'Only hosts can register a car', 403);
      return;
    }

    const existingCar = await Car.findOne({ userId });
    if (existingCar) {
      sendError(res, 'You have already registered a car. Use PUT/PATCH to update.', 400);
      return;
    }

    const carPhotos: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const path = `cars/${userId}_${Date.now()}_${file.originalname}`;
        const photoUrl = await uploadFile('media', path, file.buffer, file.mimetype);
        carPhotos.push(photoUrl);
      }
    }

    const car = await Car.create({
      userId,
      brand,
      model,
      year,
      color,
      plateNumber,
      seats,
      carPhotos,
    });

    sendSuccess(res, car, 'Car registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const updateData = req.body;
    const files = req.files as Express.Multer.File[];

    const car = await Car.findOne({ userId });
    if (!car) {
      sendError(res, 'No registered car found for this host', 404);
      return;
    }

    if (files && files.length > 0) {
      const carPhotos: string[] = [];
      for (const file of files) {
        const path = `cars/${userId}_${Date.now()}_${file.originalname}`;
        const photoUrl = await uploadFile('media', path, file.buffer, file.mimetype);
        carPhotos.push(photoUrl);
      }
      updateData.carPhotos = [...(car.carPhotos || []), ...carPhotos];
    }

    Object.assign(car, updateData);
    await car.save();

    sendSuccess(res, car, 'Car details updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const car = await Car.findOne({ userId });

    if (!car) {
      sendError(res, 'No registered car found for this host', 404);
      return;
    }

    sendSuccess(res, car, 'Car details retrieved successfully');
  } catch (error) {
    next(error);
  }
};
