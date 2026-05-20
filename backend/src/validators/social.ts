import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(2).max(100),
  wilaya: z.string().optional(),
  description: z.string().max(500).optional(),
});

export const createGroupMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  mediaUrl: z.string().url().optional(),
});

export const sendDMMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  mediaUrl: z.string().url().optional(),
});

export const createStorySchema = z.object({
  caption: z.string().max(500).optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO']),
});

export const createMomentSchema = z.object({
  rideId: z.string().min(1),
  caption: z.string().max(500).optional(),
});

export const createReportSchema = z.object({
  reportedUserId: z.string().min(1),
  rideId: z.string().optional(),
  reason: z.enum(['UNSAFE_DRIVING', 'HARASSMENT', 'FRAUD', 'FAKE_PROFILE', 'OTHER']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export const resolveReportSchema = z.object({
  status: z.enum(['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED']),
  adminNote: z.string().min(1, 'Admin note is required'),
});

export const banUserSchema = z.object({
  isBanned: z.boolean(),
});
