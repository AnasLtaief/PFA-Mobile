import { Request, Response, NextFunction } from 'express';
import Ride from '../models/Ride.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Car from '../models/Car.js';
// Notification model not needed directly here
import { sendSuccess, sendError } from '../utils/response.js';
import { sendPushNotification } from '../services/notification.js';

export const createRide = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hostId = req.user?.userId;
    const { origin, destination, wilaya, departureTime, pricePerSeat, availableSeats, paymentType, route } = req.body;

    const user = await User.findById(hostId);
    if (!user || !user.isHost) {
      sendError(res, 'Only verified hosts can create rides', 403);
      return;
    }

    const car = await Car.findOne({ userId: hostId });
    if (!car) {
      sendError(res, 'You must register a car before creating a ride', 400);
      return;
    }

    // Format coordinates as GeoJSON points
    const newRide = await Ride.create({
      hostId,
      carId: car._id,
      origin: {
        name: origin.name,
        coordinates: {
          type: 'Point',
          coordinates: [origin.coordinates.lng, origin.coordinates.lat], // Longitude, Latitude order
        },
      },
      destination: {
        name: destination.name,
        coordinates: {
          type: 'Point',
          coordinates: [destination.coordinates.lng, destination.coordinates.lat],
        },
      },
      wilaya,
      departureTime: new Date(departureTime),
      pricePerSeat,
      availableSeats,
      paymentType,
      route,
      status: 'PENDING',
    });

    sendSuccess(res, newRide, 'Ride created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const searchRides = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { wilaya, date, seats, originLat, originLng } = req.query;
    const query: any = { status: 'PENDING' };

    if (wilaya) {
      query.wilaya = wilaya;
    }

    if (date) {
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date as string);
      endOfDay.setHours(23, 59, 59, 999);
      query.departureTime = { $gte: startOfDay, $lte: endOfDay };
    } else {
      query.departureTime = { $gte: new Date() }; // Only show future rides
    }

    if (seats) {
      query.availableSeats = { $gte: parseInt(seats as string) || 1 };
    }

    // Geospatial search: 10km radius if origin coordinates are supplied
    if (originLat && originLng) {
      const lat = parseFloat(originLat as string);
      const lng = parseFloat(originLng as string);
      query['origin.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: 10000, // 10km in meters
        },
      };
    }

    const rides = await Ride.find(query)
      .populate('hostId', 'fullName email avatarUrl university isVerified')
      .populate('carId', 'brand model color plateNumber')
      .sort({ departureTime: 1 });

    sendSuccess(res, rides, 'Rides retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getRideById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('hostId', 'fullName email avatarUrl bio university phone isVerified')
      .populate('carId')
      .populate({
        path: 'bookings',
        populate: { path: 'passengerId', select: 'fullName email avatarUrl university phone' },
      });

    if (!ride) {
      sendError(res, 'Ride not found', 404);
      return;
    }

    // Fetch and append all bookings manually since Virtual populate isn't setup
    const bookings = await Booking.find({ rideId: ride._id }).populate(
      'passengerId',
      'fullName email avatarUrl university phone'
    );
    const rideObj = ride.toObject();
    (rideObj as any).bookings = bookings;

    sendSuccess(res, rideObj, 'Ride details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateRide = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hostId = req.user?.userId;
    const rideId = req.params.id;
    const updateData = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      sendError(res, 'Ride not found', 404);
      return;
    }

    if (ride.hostId.toString() !== hostId) {
      sendError(res, 'You are not the host of this ride', 403);
      return;
    }

    Object.assign(ride, updateData);
    await ride.save();

    sendSuccess(res, ride, 'Ride details updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteRide = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hostId = req.user?.userId;
    const rideId = req.params.id;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      sendError(res, 'Ride not found', 404);
      return;
    }

    if (ride.hostId.toString() !== hostId) {
      sendError(res, 'You are not the host of this ride', 403);
      return;
    }

    ride.status = 'CANCELLED';
    await ride.save();

    // Cancel all bookings and notify passengers
    const bookings = await Booking.find({ rideId: ride._id, status: { $in: ['PENDING', 'ACCEPTED'] } });
    for (const booking of bookings) {
      booking.status = 'CANCELLED';
      await booking.save();

      await sendPushNotification(
        booking.passengerId.toString(),
        'RIDE_CANCELLED',
        'Covoiturage Annulé 🚫',
        `Le conducteur a annulé le trajet de ${ride.origin.name} à ${ride.destination.name}.`,
        { rideId: ride._id.toString() }
      );
    }

    sendSuccess(res, null, 'Ride cancelled successfully');
  } catch (error) {
    next(error);
  }
};

export const bookRide = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const passengerId = req.user?.userId;
    const rideId = req.params.id;
    const { seats } = req.body;

    const ride = await Ride.findById(rideId);
    if (!ride) {
      sendError(res, 'Ride not found', 404);
      return;
    }

    if (ride.hostId.toString() === passengerId) {
      sendError(res, 'You cannot book your own ride', 400);
      return;
    }

    if (ride.status !== 'PENDING') {
      sendError(res, 'This ride is no longer open for booking', 400);
      return;
    }

    if (ride.availableSeats < seats) {
      sendError(res, 'Not enough seats available', 400);
      return;
    }

    // Check if user has already booked this ride
    const existingBooking = await Booking.findOne({ rideId, passengerId, status: { $ne: 'CANCELLED' } });
    if (existingBooking) {
      sendError(res, 'You have already booked this ride', 400);
      return;
    }

    const booking = await Booking.create({
      rideId,
      passengerId,
      seats,
      status: 'PENDING',
      paymentStatus: ride.paymentType === 'CASH' ? 'CASH' : 'PENDING',
    });

    // Notify Host
    const passenger = await User.findById(passengerId);
    await sendPushNotification(
      ride.hostId.toString(),
      'BOOKING_REQUEST',
      'Nouvelle réservation 🚗',
      `${passenger?.fullName} souhaite réserver ${seats} place(s) pour votre trajet.`,
      { rideId: ride._id.toString(), bookingId: booking._id.toString() }
    );

    sendSuccess(res, booking, 'Ride booked successfully. Waiting for host approval.', 201);
  } catch (error) {
    next(error);
  }
};

export const respondBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hostId = req.user?.userId;
    const { id: rideId, bookingId } = req.params;
    const { status } = req.body; // ACCEPTED or REJECTED

    const ride = await Ride.findById(rideId);
    if (!ride) {
      sendError(res, 'Ride not found', 404);
      return;
    }

    if (ride.hostId.toString() !== hostId) {
      sendError(res, 'Unauthorized', 403);
      return;
    }

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.rideId.toString() !== rideId) {
      sendError(res, 'Booking not found', 404);
      return;
    }

    if (booking.status !== 'PENDING') {
      sendError(res, 'Booking has already been processed', 400);
      return;
    }

    if (status === 'ACCEPTED') {
      if (ride.availableSeats < booking.seats) {
        sendError(res, 'Not enough seats remaining to accept this booking', 400);
        return;
      }
      booking.status = 'ACCEPTED';
      ride.availableSeats -= booking.seats;
      await ride.save();
    } else {
      booking.status = 'REJECTED';
    }

    await booking.save();

    // Notify passenger
    const type = status === 'ACCEPTED' ? 'BOOKING_ACCEPTED' : 'BOOKING_REJECTED';
    const title = status === 'ACCEPTED' ? 'Réservation acceptée ! 🎉' : 'Réservation refusée 😔';
    const body = status === 'ACCEPTED'
      ? `Votre réservation de ${booking.seats} place(s) pour le trajet vers ${ride.destination.name} a été acceptée.`
      : `Le conducteur a refusé votre réservation pour le trajet vers ${ride.destination.name}.`;

    await sendPushNotification(booking.passengerId.toString(), type, title, body, {
      rideId: rideId,
      bookingId: booking._id.toString(),
    });

    sendSuccess(res, booking, `Booking successfully ${status.toLowerCase()}`);
  } catch (error) {
    next(error);
  }
};

export const getMyRides = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hostId = req.user?.userId;
    const rides = await Ride.find({ hostId }).sort({ departureTime: -1 });
    sendSuccess(res, rides, 'My hosted rides retrieved');
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const passengerId = req.user?.userId;
    const bookings = await Booking.find({ passengerId })
      .populate({
        path: 'rideId',
        populate: { path: 'hostId', select: 'fullName email avatarUrl phone university' },
      })
      .sort({ createdAt: -1 });

    sendSuccess(res, bookings, 'My ride bookings retrieved');
  } catch (error) {
    next(error);
  }
};
