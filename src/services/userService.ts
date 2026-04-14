import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/hashPassword';
import { generateToken } from '../utils/jwtHelper';
import { Role } from '../constants/enum';

export const userService = {
  // Register new user
  async register(userData: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: string;
  }) {
    const { name, email, phone, password, role } = userData;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash: hashedPassword,
        role: (role as any) || Role.CUSTOMER,
      },
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
    
    return user;
  },
  
  // Login user
  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Check if user is deleted
    if (user.deletedAt) {
      throw new Error('Account has been deactivated');
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Generate token
    const token = generateToken({
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    
    return {
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  },
  
  // Get all users (admin only)
  async getAllUsers(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    
    const where: any = {
      deletedAt: null,
    };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          uuid: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    
    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
  
  // Get user by ID
  async getUserById(userId: number) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        transactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            invoiceNumber: true,
            grandTotal: true,
            paymentStatus: true,
            transactionDate: true,
          },
        },
      },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  },
  
  // Update user
  async updateUser(userId: number, updateData: {
    name?: string;
    phone?: string;
    password?: string;
  }) {
    const { name, phone, password } = updateData;
    
    const updatePayload: any = {};
    if (name) updatePayload.name = name;
    if (phone !== undefined) updatePayload.phone = phone;
    if (password) updatePayload.passwordHash = await hashPassword(password);
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: updatePayload,
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });
    
    return user;
  },
  
  // Delete user (soft delete)
  async deleteUser(userId: number) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
      select: {
        id: true,
        name: true,
        email: true,
        deletedAt: true,
      },
    });
    
    return user;
  },
  
  // Change password
  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const isPasswordValid = await comparePassword(oldPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }
    
    const hashedPassword = await hashPassword(newPassword);
    
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });
    
    return { message: 'Password changed successfully' };
  },
  
  // Get user profile
  async getProfile(userId: number) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  },
};