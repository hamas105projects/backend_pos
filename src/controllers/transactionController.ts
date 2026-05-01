import { Request, Response } from 'express';
import { transactionService } from '../services/transactionService';
import { successResponse, errorResponse, createdResponse, paginatedResponse } from '../utils/responseFormatter';

function getStringValue(param: any): string {
  if (typeof param === 'string') {
    return param;
  }
  if (Array.isArray(param) && param.length > 0 && typeof param[0] === 'string') {
    return param[0];
  }
  return '';
}

function getNumberValue(param: any): number | undefined {
  const str = getStringValue(param);
  if (!str) return undefined;
  const num = parseInt(str);
  return isNaN(num) ? undefined : num;
}

export const transactionController = {
  // Create transaction
  async createTransaction(req: Request, res: Response) {
    try {
      const transactionData = {
        ...req.body,
        userId: req.user!.id,
      };
      
      const transaction = await transactionService.createTransaction(transactionData);
      createdResponse(res, transaction, 'Transaction created successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  },
  
  // Get all transactions with filters
  async getAllTransactions(req: Request, res: Response) {
    try {
      // Pagination params
      const page = Math.max(1, getNumberValue(req.query.page) || 1);
      const limit = Math.max(1, getNumberValue(req.query.limit) || 10);
      
      // Filter params (support string format from frontend)
      const startDate = getStringValue(req.query.startDate);
      const finishDate = getStringValue(req.query.finishDate) || getStringValue(req.query.endDate);
      const paymentStatus = getStringValue(req.query.paymentStatus);
      const paymentMethod = getStringValue(req.query.paymentMethod);
      const orderType = getStringValue(req.query.orderType);
      const userId = getNumberValue(req.query.userId);
      
      // Build filters object
      const filters: any = {};
      
      // Date filters (flexible: can have start only, end only, or both)
      if (startDate) {
        filters.startDate = startDate;
      }
      if (finishDate) {
        filters.endDate = finishDate;
      }
      
      // Other filters
      if (paymentStatus && paymentStatus !== '') {
        filters.paymentStatus = paymentStatus;
      }
      if (paymentMethod && paymentMethod !== '') {
        filters.paymentMethod = paymentMethod;
      }
      if (orderType && orderType !== '') {
        filters.orderType = orderType;
      }
      
      // Role-based user filtering
      if (req.user?.role !== 'admin') {
        // Employee: only see their own transactions
        filters.userId = req.user!.id;
      } else if (userId && userId > 0) {
        // Admin: can filter by specific user
        filters.userId = userId;
      }
      
      const result = await transactionService.getAllTransactions(page, limit, filters);
      
      // Response format sesuai dengan service yang sudah diupdate
      paginatedResponse(
        res, 
        result.data, 
        result.pagination, 
        'Transactions retrieved successfully'
      );
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  },
  
  // Get transaction by ID
  async getTransactionById(req: Request, res: Response) {
    try {
      const idStr = getStringValue(req.params.id);
      const transactionId = parseInt(idStr);
      
      if (isNaN(transactionId)) {
        return errorResponse(res, 'Invalid transaction ID', 400);
      }
      
      const transaction = await transactionService.getTransactionById(transactionId);
      
      // Check permission (non-admin can only see their own transactions)
      if (req.user?.role !== 'admin' && transaction.userId !== req.user!.id) {
        return errorResponse(res, 'Forbidden: You can only view your own transactions', 403);
      }
      
      successResponse(res, transaction, 'Transaction retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 404);
    }
  },
  
  // Get transaction by invoice number
  async getTransactionByInvoice(req: Request, res: Response) {
    try {
      const invoiceNumber = getStringValue(req.params.invoiceNumber);
      
      if (!invoiceNumber) {
        return errorResponse(res, 'Invoice number is required', 400);
      }
      
      const transaction = await transactionService.getTransactionByInvoice(invoiceNumber);
      
      // Check permission
      if (req.user?.role !== 'admin' && transaction.userId !== req.user!.id) {
        return errorResponse(res, 'Forbidden: You can only view your own transactions', 403);
      }
      
      successResponse(res, transaction, 'Transaction retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 404);
    }
  },
  
  // Update payment status
  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const idStr = getStringValue(req.params.id);
      const transactionId = parseInt(idStr);
      
      if (isNaN(transactionId)) {
        return errorResponse(res, 'Invalid transaction ID', 400);
      }
      
      const { paymentStatus } = req.body;
      
      if (!paymentStatus) {
        return errorResponse(res, 'Payment status is required', 400);
      }
      
      // Check permission first
      const transaction = await transactionService.getTransactionById(transactionId);
      
      if (req.user?.role !== 'admin' && transaction.userId !== req.user!.id) {
        return errorResponse(res, 'Forbidden: You can only update your own transactions', 403);
      }
      
      const updatedTransaction = await transactionService.updatePaymentStatus(transactionId, paymentStatus);
      successResponse(res, updatedTransaction, 'Payment status updated successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  },
  
  // Cancel transaction
  async cancelTransaction(req: Request, res: Response) {
    try {
      const idStr = getStringValue(req.params.id);
      const transactionId = parseInt(idStr);
      
      if (isNaN(transactionId)) {
        return errorResponse(res, 'Invalid transaction ID', 400);
      }
      
      // Get transaction to check permission
      const transaction = await transactionService.getTransactionById(transactionId);
      
      if (req.user?.role !== 'admin' && transaction.userId !== req.user!.id) {
        return errorResponse(res, 'Forbidden: You can only cancel your own transactions', 403);
      }
      
      const result = await transactionService.cancelTransaction(transactionId);
      successResponse(res, result, 'Transaction cancelled successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 400);
    }
  },
};