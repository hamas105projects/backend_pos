import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { successResponse, errorResponse, createdResponse, paginatedResponse } from '../utils/responseFormatter';

export const userController = {
  // Register new user
  async register(req: Request, res: Response) {
    try {
      const { name, email, phone, password, role } = req.body;
      const user = await userService.register({ name, email, phone, password, role });
      createdResponse(res, user, 'User registered successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  },
  
  // Login user
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      successResponse(res, result, 'Login successful');
    } catch (error: any) {
      errorResponse(res, error.message, 401);
    }
  },
  
  // Get all users (admin only)
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = Math.max(1, parseInt(String(req.query.page || '1')) || 1);
      const limit = Math.max(1, parseInt(String(req.query.limit || '10')) || 10);
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      
      const result = await userService.getAllUsers(page, limit, search);
      paginatedResponse(res, result.users, result.pagination, 'Users retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  },
  
  // Get user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(String(req.params.id));
      if (isNaN(userId)) {
        return errorResponse(res, 'Invalid user ID', 400);
      }
      const user = await userService.getUserById(userId);
      successResponse(res, user, 'User retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 404);
    }
  },
  
  // Get current user profile
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const user = await userService.getProfile(userId);
      successResponse(res, user, 'Profile retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 404);
    }
  },
  
  // Update user
  async updateUser(req: Request, res: Response) {
    try {
      const userId = parseInt(String(req.params.id));
      if (isNaN(userId)) {
        return errorResponse(res, 'Invalid user ID', 400);
      }
      const { name, phone, password } = req.body;
      
      const user = await userService.updateUser(userId, { name, phone, password });
      successResponse(res, user, 'User updated successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  },
  
  // Update own profile
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { name, phone, password } = req.body;
      
      const user = await userService.updateUser(userId, { name, phone, password });
      successResponse(res, user, 'Profile updated successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  },
  
  // Delete user (soft delete)
  async deleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(String(req.params.id));
      if (isNaN(userId)) {
        return errorResponse(res, 'Invalid user ID', 400);
      }
      const user = await userService.deleteUser(userId);
      successResponse(res, user, 'User deleted successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  },
  
  // Change password
  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { oldPassword, newPassword } = req.body;
      
      const result = await userService.changePassword(userId, oldPassword, newPassword);
      successResponse(res, result, 'Password changed successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  },
};