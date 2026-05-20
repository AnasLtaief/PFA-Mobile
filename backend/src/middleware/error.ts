import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import multer from 'multer';

/**
 * Custom application error with an HTTP status code.
 */
export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Mongoose error shapes (defined here to avoid a hard dependency on mongoose at import time)
interface MongooseValidationError extends Error {
  name: 'ValidationError';
  errors: Record<string, { message: string; path: string }>;
}

interface MongooseCastError extends Error {
  name: 'CastError';
  kind: string;
  path: string;
  value: unknown;
}

const isMongooseValidationError = (err: Error): err is MongooseValidationError =>
  err.name === 'ValidationError' && 'errors' in err;

const isMongooseCastError = (err: Error): err is MongooseCastError =>
  err.name === 'CastError' && 'kind' in err;

/**
 * Global error handling middleware.
 * Must be registered AFTER all routes.
 *
 * Handles:
 *  - AppError (custom)
 *  - Mongoose ValidationError -> 400
 *  - Mongoose CastError -> 400
 *  - JWT JsonWebTokenError -> 401
 *  - JWT TokenExpiredError -> 401
 *  - Multer errors -> 400
 *  - Zod errors -> 400
 *  - Everything else -> 500
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // ── Custom AppError ────────────────────────────────────────────────
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      data: null,
      message: err.message,
      error: err.message,
    });
    return;
  }

  // ── Mongoose ValidationError ───────────────────────────────────────
  if (isMongooseValidationError(err)) {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');

    res.status(400).json({
      success: false,
      data: null,
      message: 'Validation failed',
      error: messages,
    });
    return;
  }

  // ── Mongoose CastError ─────────────────────────────────────────────
  if (isMongooseCastError(err)) {
    res.status(400).json({
      success: false,
      data: null,
      message: `Invalid value for ${err.path}`,
      error: `Cannot cast "${String(err.value)}" to ${err.kind}`,
    });
    return;
  }

  // ── JWT TokenExpiredError ──────────────────────────────────────────
  if (err instanceof TokenExpiredError) {
    res.status(401).json({
      success: false,
      data: null,
      message: 'Token expired',
      error: 'Your authentication token has expired. Please log in again.',
    });
    return;
  }

  // ── JWT JsonWebTokenError ──────────────────────────────────────────
  if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid token',
      error: 'The provided authentication token is invalid.',
    });
    return;
  }

  // ── Multer errors ──────────────────────────────────────────────────
  if (err instanceof multer.MulterError) {
    let message = 'File upload error';

    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'File is too large';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files';
        break;
      case 'LIMIT_FIELD_KEY':
        message = 'Field name is too long';
        break;
      case 'LIMIT_FIELD_VALUE':
        message = 'Field value is too long';
        break;
      case 'LIMIT_FIELD_COUNT':
        message = 'Too many fields';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unsupported file type. Allowed: jpeg, jpg, png, gif, webp, mp4, mov, avi';
        break;
      case 'LIMIT_PART_COUNT':
        message = 'Too many parts';
        break;
    }

    res.status(400).json({
      success: false,
      data: null,
      message,
      error: message,
    });
    return;
  }

  // ── Zod errors ─────────────────────────────────────────────────────
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    res.status(400).json({
      success: false,
      data: null,
      message: 'Validation failed',
      error: formattedErrors.map((e) => `${e.field}: ${e.message}`).join(', '),
    });
    return;
  }

  // ── Default 500 ────────────────────────────────────────────────────
  console.error('Unhandled error:', err);

  const isProduction = process.env.NODE_ENV === 'production';

  res.status(500).json({
    success: false,
    data: null,
    message: 'Internal server error',
    error: isProduction ? 'An unexpected error occurred' : err.message || 'Unknown error',
  });
};

export default errorHandler;
