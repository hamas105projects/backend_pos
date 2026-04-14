import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import env from '../config/env';
import { errorResponse } from '../utils/responseFormatter';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });
  
  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  
  // Prisma error mapping
  if (err.code && err.code.startsWith('P')) {
    statusCode = 400;
    message = getPrismaErrorMessage(err);
  }
  
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  // Multer error
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
    } else {
      message = err.message;
    }
  }
  
  // Send response
  errorResponse(res, message, statusCode, env.isDevelopment ? err.stack : null);
};

/**
 * Get user-friendly Prisma error message
 */
function getPrismaErrorMessage(err: any): string {
  const errorMessages: Record<string, string> = {
    P2000: 'Input value is too long',
    P2001: 'Record does not exist',
    P2002: `Data already exists: ${err.meta?.target?.join(', ') || 'unique field'}`,
    P2003: 'Related record not found',
    P2005: 'Invalid value for database',
    P2011: 'Required field is missing',
    P2012: 'Missing required field',
    P2014: 'Invalid ID format',
    P2015: 'Record not found',
    P2016: 'Query error',
    P2017: 'Records not connected',
    P2018: 'Connected records not found',
    P2025: 'Record not found',
  };
  
  return errorMessages[err.code] || 'Database error occurred';
}

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  errorResponse(res, `Cannot ${req.method} ${req.url}`, 404);
};