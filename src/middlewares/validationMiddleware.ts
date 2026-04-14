import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/responseFormatter';
import Joi from 'joi';

/**
 * Validation middleware factory for Joi
 * @param schema - Joi schema
 * @param source - 'body', 'query', or 'params'
 */
export const validate = (schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const dataToValidate = req[source];
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });
    
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      errorResponse(res, 'Validation failed', 400, errors);
      return;
    }
    
    req[source] = value;
    next();
  };
};

/**
 * Sanitize input (remove dangerous characters)
 */
export const sanitize = (req: Request, res: Response, next: NextFunction): void => {
  const sanitizeObject = (obj: any): any => {
    if (!obj) return obj;
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        // Remove potential XSS
        sanitized[key] = value.replace(/[<>]/g, '').trim();
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };
  
  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);
  next();
};