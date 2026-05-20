import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, AccessTokenPayload } from '../utils/token.js';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

/**
 * Extract the Bearer token from the Authorization header.
 *
 * @param req - Express Request object
 * @returns The token string, or null if not present / malformed
 */
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
};

/**
 * Authentication middleware — **required** auth.
 *
 * Extracts and verifies the JWT from the Authorization header,
 * then attaches `{ userId, role }` to `req.user`.
 *
 * Returns 401 on missing / invalid / expired tokens.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req);

    if (!token) {
      res.status(401).json({
        success: false,
        data: null,
        message: 'Unauthorized',
        error: 'No authentication token provided',
      });
      return;
    }

    const decoded: AccessTokenPayload = verifyAccessToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        success: false,
        data: null,
        message: 'Unauthorized',
        error: 'Token has expired. Please log in again.',
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        success: false,
        data: null,
        message: 'Unauthorized',
        error: 'Invalid authentication token',
      });
      return;
    }

    res.status(401).json({
      success: false,
      data: null,
      message: 'Unauthorized',
      error: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication middleware.
 *
 * If a valid token is present it attaches `req.user`;
 * if no token is provided or it is invalid the request continues
 * without `req.user` (no error response is sent).
 */
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractToken(req);

    if (token) {
      const decoded: AccessTokenPayload = verifyAccessToken(token);
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      };
    }
  } catch {
    // Silently ignore — req.user will remain undefined
  }

  next();
};

export default authenticate;
