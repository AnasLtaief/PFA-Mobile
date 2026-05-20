import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  amount: z.number().positive('Amount must be greater than zero'),
});
