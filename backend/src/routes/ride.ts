import { Router } from 'express';
import * as rideController from '../controllers/ride.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import {
  createRideSchema,
  updateRideSchema,
  searchRidesSchema,
  bookRideSchema,
  updateBookingSchema,
} from '../validators/ride.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createRideSchema, 'body'), rideController.createRide);
router.get('/', validate(searchRidesSchema, 'query'), rideController.searchRides);
router.get('/my-rides', rideController.getMyRides);
router.get('/my-bookings', rideController.getMyBookings);

router.get('/:id', rideController.getRideById);
router.patch('/:id', validate(updateRideSchema, 'body'), rideController.updateRide);
router.delete('/:id', rideController.deleteRide);

// Bookings
router.post('/:id/book', validate(bookRideSchema, 'body'), rideController.bookRide);
router.patch('/:id/booking/:bookingId', validate(updateBookingSchema, 'body'), rideController.respondBooking);

export default router;
