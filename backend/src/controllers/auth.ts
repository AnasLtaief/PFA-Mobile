import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.js';
import { generateSecret, generateQRCode, verifyToken as verify2FAToken, generateBackupCodes } from '../services/twofa.js';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, email, phone, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, ...(phone ? [{ phone }] : [])] });
    if (existingUser) {
      sendError(res, 'User with this email or phone already exists', 400);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      passwordHash,
    });

    // Generate email verification token (expires in 24h)
    const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '24h' });
    await sendVerificationEmail(user.email, verificationToken);

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(res, {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        twoFAEnabled: user.twoFAEnabled,
      },
      accessToken,
    }, 'Registration successful. Verification email sent.', 21);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, twoFAToken } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      sendError(res, 'Invalid credentials', 401);
      return;
    }

    if (user.isBanned) {
      sendError(res, 'Your account has been banned. Contact support.', 403);
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      sendError(res, 'Invalid credentials', 401);
      return;
    }

    if (user.twoFAEnabled) {
      if (!twoFAToken) {
        sendSuccess(res, { require2FA: true }, '2FA verification required', 200);
        return;
      }

      const isValid = verify2FAToken(user.twoFASecret!, twoFAToken);
      if (!isValid) {
        // Also check backup codes
        const isBackupMatch = user.backupCodes.includes(twoFAToken);
        if (isBackupMatch) {
          // Remove backup code
          user.backupCodes = user.backupCodes.filter((code) => code !== twoFAToken);
          await user.save();
        } else {
          sendError(res, 'Invalid 2FA token', 401);
          return;
        }
      }
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        twoFAEnabled: user.twoFAEnabled,
        isHost: user.isHost,
      },
      accessToken,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie('refreshToken');
    sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      sendError(res, 'Refresh token missing', 401);
      return;
    }

    const decoded = verifyRefreshToken(token) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user || user.isBanned) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const newRefreshToken = generateRefreshToken(user._id.toString());

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, { accessToken }, 'Token refreshed successfully');
  } catch (error) {
    sendError(res, 'Invalid refresh token', 401);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      await sendPasswordResetEmail(user.email, resetToken);
    }

    // Always send success to prevent email enumeration
    sendSuccess(res, null, 'If that email exists, we have sent a reset password link');
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    sendSuccess(res, null, 'Password reset successful');
  } catch (error) {
    sendError(res, 'Invalid or expired token', 400);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    user.isVerified = true;
    await user.save();

    sendSuccess(res, null, 'Email verified successfully');
  } catch (error) {
    sendError(res, 'Invalid or expired token', 400);
  }
};

export const setup2FA = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);

    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    const { secret, otpauthUrl } = generateSecret(user.email);
    const qrCodeImage = await generateQRCode(otpauthUrl!);

    user.twoFASecret = secret;
    await user.save();

    sendSuccess(res, {
      qrCode: qrCodeImage,
      manualKey: secret,
    }, '2FA setup generated');
  } catch (error) {
    next(error);
  }
};

export const verify2FA = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { token } = req.body;
    const user = await User.findById(userId);

    if (!user || !user.twoFASecret) {
      sendError(res, '2FA setup not initiated', 400);
      return;
    }

    const isValid = verify2FAToken(user.twoFASecret, token);
    if (!isValid) {
      sendError(res, 'Invalid verification code', 400);
      return;
    }

    const backupCodes = generateBackupCodes();
    const hashedBackupCodes = await Promise.all(backupCodes.map((code) => bcrypt.hash(code, 10)));

    user.twoFAEnabled = true;
    user.backupCodes = backupCodes; // Return clean backup codes to user once
    await user.save();

    sendSuccess(res, { backupCodes }, '2FA enabled successfully. Store these backup codes safely.');
  } catch (error) {
    next(error);
  }
};

export const disable2FA = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { token } = req.body;
    const user = await User.findById(userId);

    if (!user || !user.twoFASecret) {
      sendError(res, '2FA not enabled', 400);
      return;
    }

    const isValid = verify2FAToken(user.twoFASecret, token);
    if (!isValid) {
      sendError(res, 'Invalid verification code', 400);
      return;
    }

    user.twoFAEnabled = false;
    user.twoFASecret = undefined;
    user.backupCodes = [];
    await user.save();

    sendSuccess(res, null, '2FA disabled successfully');
  } catch (error) {
    next(error);
  }
};
