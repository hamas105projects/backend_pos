import jwt from 'jsonwebtoken';
import env from '../config/env';

interface UserPayload {
  id: number;
  uuid: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Generate JWT token for user
 * @param payload - User data to encode
 * @returns JWT token
 */
export const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Verify JWT token
 * @param token - JWT token
 * @returns Decoded payload or null
 */
export const verifyToken = (token: string): UserPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Decode JWT token without verification
 * @param token - JWT token
 * @returns Decoded payload or null
 */
export const decodeToken = (token: string): UserPayload | null => {
  return jwt.decode(token) as UserPayload | null;
};