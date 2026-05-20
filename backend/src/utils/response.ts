import { Response } from 'express';

interface SuccessResponse {
  success: true;
  data: unknown;
  message: string;
}

interface ErrorResponse {
  success: false;
  data: null;
  message: string;
  error: string;
}

export const sendSuccess = (
  res: Response,
  data: unknown = null,
  message: string = 'Success',
  statusCode: number = 200
): Response<SuccessResponse> => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const sendError = (
  res: Response,
  message: string = 'Error',
  statusCode: number = 500,
  error?: string
): Response<ErrorResponse> => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    error: error || message,
  });
};
