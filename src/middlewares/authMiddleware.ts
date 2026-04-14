import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtHelper';
import { errorResponse } from '../utils/responseFormatter';
import { prisma } from '../config/database';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        uuid: string;
        name: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to verify JWT token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      errorResponse(res, 'No token provided', 401);
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      errorResponse(res, 'Invalid or expired token', 401);
      return;
    }
    
    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        role: true,
        deletedAt: true,
      },
    });
    
    if (!user) {
      errorResponse(res, 'User not found or inactive', 401);
      return;
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    errorResponse(res, 'Authentication failed', 401);
  }
};

/**
 * Middleware to authorize based on roles
 * @param roles - Allowed roles
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      errorResponse(res, 'Unauthorized', 401);
      return;
    }
    
    if (!roles.includes(req.user.role)) {
      errorResponse(res, 'Forbidden: Insufficient permissions', 403);
      return;
    }
    
    next();
  };
};

/**
 * Optional authentication (doesn't require token, but attaches user if present)
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      
      if (decoded) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            uuid: true,
            name: true,
            email: true,
            role: true,
          },
        });
        if (user) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};