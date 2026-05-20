import { z } from 'zod';

export const becomeHostSchema = z.object({
  stripeToken: z.string().optional(),
});

export const createCarSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1980).max(new Date().getFullYear() + 1),
  color: z.string().min(1, 'Color is required'),
  plateNumber: z.string().min(1, 'Plate number is required'),
  seats: z.number().int().min(1).max(8),
});

export const updateCarSchema = createCarSchema.partial();
