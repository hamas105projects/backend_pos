import Joi from 'joi';
import { Role } from '../constants/enum';

// Register user validation
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().allow(null, ''),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid(...Object.values(Role)).default(Role.CUSTOMER),
});

// Login validation
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Update user validation
export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional().allow(null, ''),
  password: Joi.string().min(6).max(100).optional(),
}).min(1);

// Change password validation
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(100).required(),
});