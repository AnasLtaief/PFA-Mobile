import { z } from 'zod';

const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const createRideSchema = z.object({
  carId: z.string().optional(),
  origin: z.object({
    name: z.string().min(1),
    coordinates: coordinatesSchema,
  }),
  destination: z.object({
    name: z.string().min(1),
    coordinates: coordinatesSchema,
  }),
  wilaya: z.string().min(1),
  departureTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid departure time date format',
  }),
  pricePerSeat: z.number().positive(),
  availableSeats: z.number().int().min(1).max(8),
  paymentType: z.enum(['CASH', 'CARD']),
  route: z.array(coordinatesSchema).optional(),
});

export const updateRideSchema = createRideSchema.partial();

export const searchRidesSchema = z.object({
  wilaya: z.string().optional(),
  date: z.string().optional(),
  seats: z.string().transform((val) => parseInt(val) || 1).optional(),
  originLat: z.string().transform((val) => parseFloat(val)).optional(),
  originLng: z.string().transform((val) => parseFloat(val)).optional(),
  destLat: z.string().transform((val) => parseFloat(val)).optional(),
  destLng: z.string().transform((val) => parseFloat(val)).optional(),
});

export const bookRideSchema = z.object({
  seats: z.number().int().min(1).default(1),
});

export const updateBookingSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED', 'CANCELLED']),
});
