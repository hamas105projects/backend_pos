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
  
  // Get all transactions
  async getAllTransactions(req: Request, res: Response) {
    try {
      const pageStr = getStringValue(req.query.page);
      const page = Math.max(1, parseInt(pageStr || '1') || 1);
      const limitStr = getStringValue(req.query.limit);
      const limit = Math.max(1, parseInt(limitStr || '10') || 10);
      const startDateStr = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
      const startDate = startDateStr ? new Date(startDateStr) : undefined;
      const endDateStr = typeof req.query.endDate === 'string' ? req.query.endDate : undefined;
      const endDate = endDateStr ? new Date(endDateStr) : undefined;
      const paymentStatus = typeof req.query.paymentStatus === 'string' ? req.query.paymentStatus : undefined;
      const paymentMethod = typeof req.query.paymentMethod === 'string' ? req.query.paymentMethod : undefined;
      
      const filters: any = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (paymentStatus) filters.paymentStatus = paymentStatus;
      if (paymentMethod) filters.paymentMethod = paymentMethod;
      
      // If user is not admin, only show their own transactions
      if (req.user?.role !== 'admin') {
        filters.userId = req.user!.id;
      }
      
      const result = await transactionService.getAllTransactions(page, limit, filters);
      paginatedResponse(res, result.transactions, result.pagination, 'Transactions retrieved successfully');
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
  
  // Update payment status (admin only)
  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const idStr = getStringValue(req.params.id);
      const transactionId = parseInt(idStr);
      if (isNaN(transactionId)) {
        return errorResponse(res, 'Invalid transaction ID', 400);
      }
      const { paymentStatus } = req.body;
      
      const transaction = await transactionService.updatePaymentStatus(transactionId, paymentStatus);
      successResponse(res, transaction, 'Payment status updated successfully');
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
  
  // Get daily sales report (admin only)
  async getDailySalesReport(req: Request, res: Response) {
    try {
      const dateStr = typeof req.query.date === 'string' ? req.query.date : getStringValue(req.query.date);
      const date = dateStr ? new Date(dateStr) : new Date();
      const report = await transactionService.getDailySalesReport(date);
      successResponse(res, report, 'Daily sales report retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  },
  
  // Get monthly sales report (admin only)
  async getMonthlySalesReport(req: Request, res: Response) {
    try {
      const yearStr = getStringValue(req.query.year);
      const year = parseInt(yearStr) || new Date().getFullYear();
      const monthStr = getStringValue(req.query.month);
      const month = parseInt(monthStr) || new Date().getMonth() + 1;
      
      const report = await transactionService.getMonthlySalesReport(year, month);
      successResponse(res, report, 'Monthly sales report retrieved successfully');
    } catch (error: any) {
      errorResponse(res, error.message, 500);
    }
  },
};

