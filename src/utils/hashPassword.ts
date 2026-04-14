import bcrypt from 'bcrypt';
import env from '../config/env';

/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(env.BCRYPT_ROUNDS);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare plain text password with hash
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns True if match
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};