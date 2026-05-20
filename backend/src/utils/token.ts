import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export interface AccessTokenPayload extends JwtPayload {
  userId: string;
  role: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  userId: string;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  return secret;
};

const getJwtRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET environment variable is not defined');
  }
  return secret;
};

export const generateAccessToken = (userId: string, role: string): string => {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN || '15m';

  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };

  return jwt.sign({ userId, role }, secret, options);
};

export const generateRefreshToken = (userId: string): string => {
  const secret = getJwtRefreshSecret();
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };

  return jwt.sign({ userId }, secret, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const secret = getJwtSecret();
  const decoded = jwt.verify(token, secret) as AccessTokenPayload;
  return decoded;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  const secret = getJwtRefreshSecret();
  const decoded = jwt.verify(token, secret) as RefreshTokenPayload;
  return decoded;
};
