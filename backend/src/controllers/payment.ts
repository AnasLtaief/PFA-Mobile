import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Ride from '../models/Ride.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { sendPushNotification } from '../services/notification.js';
import { sendPaymentReceipt } from '../services/email.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16' as any,
});

export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const passengerId = req.user?.userId;
    const { bookingId, amount } = req.body; // amount in DZD

    const booking = await Booking.findById(bookingId).populate('rideId');
    if (!booking) {
      sendError(res, 'Booking not found', 404);
      return;
    }

    if (booking.passengerId.toString() !== passengerId) {
      sendError(res, 'Unauthorized', 403);
      return;
    }

    const passengerUser = await User.findById(passengerId);
    let stripeCustomerId = passengerUser?.stripeCustomerId;

    if (!stripeCustomerId && passengerUser) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: passengerUser.email,
        name: passengerUser.fullName,
      });
      stripeCustomerId = customer.id;
      passengerUser.stripeCustomerId = stripeCustomerId;
      await passengerUser.save();
    }

    // Stripe uses cents/smallest unit. Convert DZD to cents (or equivalent minimum integer, e.g. DZD is 0-decimal or 2-decimal, Stripe handles DZD as 2-decimal)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // convert DZD to cents
      currency: 'dzd',
      customer: stripeCustomerId,
      metadata: {
        bookingId: booking._id.toString(),
        passengerId: passengerId,
        rideId: booking.rideId._id.toString(),
      },
    });

    booking.stripePaymentIntentId = paymentIntent.id;
    await booking.save();

    sendSuccess(res, {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    }, 'Payment intent created successfully');
  } catch (error: any) {
    next(error);
  }
};

export const handleStripeWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata.bookingId;

      const booking = await Booking.findById(bookingId).populate('rideId');
      if (booking) {
        booking.paymentStatus = 'PAID';
        await booking.save();

        const ride = await Ride.findById(booking.rideId._id).populate('hostId');
        const passenger = await User.findById(booking.passengerId);

        // Notify Host and Passenger
        if (ride) {
          await sendPushNotification(
            ride.hostId.toString(),
            'BOOKING_PAID',
            'Paiement reçu 💳',
            `Le passager ${passenger?.fullName} a payé en ligne pour son trajet.`,
            { rideId: ride._id.toString() }
          );

          if (passenger) {
            await sendPushNotification(
              passenger._id.toString(),
              'PAYMENT_SUCCESS',
              'Paiement réussi ! 🎉',
              `Votre paiement de ${(paymentIntent.amount / 100).toFixed(2)} DZD pour le trajet vers ${ride.destination.name} a été confirmé.`,
              { rideId: ride._id.toString() }
            );

            // Send Email Receipt
            await sendPaymentReceipt(passenger.email, {
              amount: paymentIntent.amount / 100,
              rideDetails: `Trajet de ${ride.origin.name} à ${ride.destination.name}`,
              date: new Date(),
              paymentId: paymentIntent.id,
            });
          }
        }
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata.bookingId;

      const booking = await Booking.findById(bookingId).populate('rideId');
      if (booking) {
        booking.paymentStatus = 'PENDING';
        await booking.save();

        const passenger = await User.findById(booking.passengerId);
        if (passenger) {
          await sendPushNotification(
            passenger._id.toString(),
            'PAYMENT_FAILED',
            'Échec du paiement ❌',
            `Le paiement en ligne pour votre trajet a échoué. Veuillez réessayer.`,
            { bookingId: booking._id.toString() }
          );
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

export const getPaymentHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Retrieve all bookings where the user was a passenger and Stripe payment intent is present
    const bookings = await Booking.find({
      passengerId: userId,
      stripePaymentIntentId: { $ne: null },
    })
      .populate({
        path: 'rideId',
        populate: { path: 'hostId', select: 'fullName email avatarUrl' },
      })
      .sort({ createdAt: -1 });

    sendSuccess(res, bookings, 'Payment history retrieved successfully');
  } catch (error) {
    next(error);
  }
};
