import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    sendError(res, 'Access denied. Administrator privileges required.', 403);
  }
};

export default isAdmin;
