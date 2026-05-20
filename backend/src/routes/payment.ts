import { Router } from 'express';
import * as paymentController from '../controllers/payment.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { createPaymentIntentSchema } from '../validators/payment.js';

const router = Router();

// Hook up authentication for standard endpoints
router.get('/history', authenticate, paymentController.getPaymentHistory);
router.post('/create-intent', authenticate, validate(createPaymentIntentSchema, 'body'), paymentController.createPaymentIntent);

// Note: Stripe webhook is mounted directly in app.ts before json parser.

export default router;
