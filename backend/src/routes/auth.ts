import { Router } from 'express';
import * as authController from '../controllers/auth.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  twoFAVerifySchema,
  twoFADisableSchema,
} from '../validators/auth.js';

const router = Router();

router.post('/register', validate(registerSchema, 'body'), authController.register);
router.post('/login', validate(loginSchema, 'body'), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', validate(forgotPasswordSchema, 'body'), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema, 'body'), authController.resetPassword);
router.post('/verify-email', validate(verifyEmailSchema, 'body'), authController.verifyEmail);

// 2FA Routes (Protected)
router.post('/2fa/setup', authenticate, authController.setup2FA);
router.post('/2fa/verify', authenticate, validate(twoFAVerifySchema, 'body'), authController.verify2FA);
router.post('/2fa/disable', authenticate, validate(twoFADisableSchema, 'body'), authController.disable2FA);

export default router;
