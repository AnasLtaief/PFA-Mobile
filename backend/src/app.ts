import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import hostRoutes from './routes/host.js';
import rideRoutes from './routes/ride.js';
import paymentRoutes from './routes/payment.js';
import storyRoutes from './routes/story.js';
import momentRoutes from './routes/moment.js';
import groupRoutes from './routes/group.js';
import messageRoutes from './routes/message.js';
import reportRoutes from './routes/report.js';
import adminRoutes from './routes/admin.js';

import { handleStripeWebhook } from './controllers/payment.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// Security Headers
app.use(helmet());

// Request logger
app.use(morgan('dev'));

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  process.env.ADMIN_URL || 'http://localhost:5174',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Cookie Parser
app.use(cookieParser());

// Stripe Webhook Endpoint (MUST be defined before express.json() parser for body raw signature check)
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Body Parsers for standard routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Campus Covoiturage API Server' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/host', hostRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/moments', momentRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
export { app };
