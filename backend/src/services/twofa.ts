import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface TwoFASecret {
  secret: string; // base32 encoded secret
  otpauthUrl: string; // otpauth:// URL for authenticator apps
}

/**
 * Generate a new TOTP secret for a user.
 *
 * @param email - User email, used as the account label in authenticator apps
 * @returns The base32-encoded secret and the otpauth URL
 */
export const generateSecret = (email: string): TwoFASecret => {
  const secret = speakeasy.generateSecret({
    name: `Campus Covoiturage (${email})`,
    issuer: 'Campus Covoiturage',
    length: 32,
  });

  if (!secret.base32 || !secret.otpauth_url) {
    throw new Error('Failed to generate 2FA secret');
  }

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
  };
};

/**
 * Generate a QR code image as a base64-encoded data URL.
 *
 * @param otpauthUrl - The otpauth:// URL to encode
 * @returns A base64 data URL string (data:image/png;base64,...)
 */
export const generateQRCode = async (otpauthUrl: string): Promise<string> => {
  try {
    const dataUrl = await QRCode.toDataURL(otpauthUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return dataUrl;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`QR code generation failed: ${errMsg}`);
  }
};

/**
 * Verify a TOTP token against a secret.
 *
 * @param secret - The base32-encoded secret
 * @param token  - The 6-digit TOTP code entered by the user
 * @returns true if the token is valid (within ±1 time step window)
 */
export const verifyToken = (secret: string, token: string): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1, // Allow ±1 time step (30 seconds each) for clock drift
  });
};

/**
 * Generate a set of single-use backup codes for account recovery.
 *
 * @returns An array of 10 random 8-character alphanumeric codes
 */
export const generateBackupCodes = (): string[] => {
  const codes: string[] = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < 10; i++) {
    const bytes = crypto.randomBytes(8);
    let code = '';
    for (let j = 0; j < 8; j++) {
      code += chars[bytes[j] % chars.length];
    }
    codes.push(code);
  }

  return codes;
};

/**
 * Hash a backup code with bcrypt for secure storage.
 *
 * @param code - The plaintext backup code
 * @returns The bcrypt hash of the code
 */
export const hashBackupCode = async (code: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(code.toUpperCase(), salt);
};

/**
 * Verify a backup code against a list of hashed codes.
 * Returns whether the code is valid and the remaining unused hashed codes
 * (the matched code is removed).
 *
 * @param code       - The plaintext backup code entered by the user
 * @param hashedCodes - Array of bcrypt-hashed backup codes stored in the DB
 * @returns An object with `valid` boolean and `remainingCodes` (hashed codes minus the used one)
 */
export const verifyBackupCode = async (
  code: string,
  hashedCodes: string[]
): Promise<{ valid: boolean; remainingCodes: string[] }> => {
  const normalised = code.toUpperCase();

  for (let i = 0; i < hashedCodes.length; i++) {
    const isMatch = await bcrypt.compare(normalised, hashedCodes[i]);
    if (isMatch) {
      // Remove the used code and return remaining
      const remainingCodes = [...hashedCodes.slice(0, i), ...hashedCodes.slice(i + 1)];
      return { valid: true, remainingCodes };
    }
  }

  return { valid: false, remainingCodes: hashedCodes };
};
