import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type ValidationSource = 'body' | 'query' | 'params';

/**
 * Generic validation middleware factory.
 * Accepts a Zod schema and the request property to validate against.
 *
 * @param schema - A Zod schema to validate against
 * @param source - Which part of the request to validate: 'body', 'query', or 'params'
 * @returns Express middleware function
 *
 * @example
 * router.post('/rides', validate(createRideSchema, 'body'), createRide);
 * router.get('/rides', validate(querySchema, 'query'), getRides);
 */
export const validate = (schema: ZodSchema, source: ValidationSource = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req[source];
      const result = schema.safeParse(data);

      if (!result.success) {
        const zodError = result.error as ZodError;
        const formattedErrors = zodError.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        res.status(400).json({
          success: false,
          data: null,
          message: 'Validation failed',
          error: 'Invalid request data',
          details: formattedErrors,
        });
        return;
      }

      // Replace the source data with the parsed (and potentially transformed) data
      (req as any)[source] = result.data;
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        data: null,
        message: 'Validation error',
        error: error instanceof Error ? error.message : 'Unknown validation error',
      });
    }
  };
};

export default validate;
