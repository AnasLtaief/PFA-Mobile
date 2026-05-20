import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  university: z.string().max(150).optional(),
  wilaya: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().min(9).max(15),
    relation: z.string().min(2).max(50),
  }).optional(),
  fcmToken: z.string().optional(),
});

export const friendRequestResponseSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED']),
});

export const searchUsersSchema = z.object({
  q: z.string().optional().default(''),
  wilaya: z.string().optional(),
});
