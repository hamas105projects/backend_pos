import { Response } from 'express';

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Success response formatter
export const successResponse = <T>(
  res: Response,
  data: T | null = null,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

// Error response formatter
export const errorResponse = (
  res: Response,
  message: string = 'Error',
  statusCode: number = 500,
  errors: any = null
): Response => {
  const response: any = {
    status: 'error',
    message,
    timestamp: new Date().toISOString(),
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

// Pagination response formatter
export const paginatedResponse = <T>(
  res: Response,
  data: T,
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  message: string = 'Success'
): Response => {
  const { page, limit, total, totalPages } = pagination;
  return res.status(200).json({
    status: 'success',
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
};

// Created response (201)
export const createdResponse = <T>(
  res: Response,
  data: T | null = null,
  message: string = 'Resource created successfully'
): Response => {
  return successResponse(res, data, message, 201);
};

// No content response (204)
export const noContentResponse = (res: Response): Response => {
  return res.status(204).send();
};