import { prisma } from '../config/database';
import { generateInvoiceNumber } from '../utils/generateInvoice';
import { calculateSubtotal, calculateGrandTotal } from '../utils/calculatePrice';
import { PaymentStatus } from '../constants/enum';

export const transactionService = {
  // Create new transaction
  async createTransaction(transactionData: {
    userId: number;
    customerName: string;
    paymentMethod: string;
    orderType: string;
    discount?: number;
    tax?: number;
    notes?: string;
    items: Array<{
      productId: number;
      quantity: number;
    }>;
  }) {
    const {
      userId,
      customerName,
      paymentMethod,
      orderType,
      discount = 0,
      tax = 0,
      notes,
      items,
    } = transactionData;
    
    // Validate items and calculate totals
    let totalAmount = 0;
    const transactionItems = [];
    
    for (const item of items) {
      const product = await prisma.product.findFirst({
        where: {
          id: item.productId,
          deletedAt: null,
        },
      });
      
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      
      const subtotal = calculateSubtotal(item.quantity, Number(product.price));
      totalAmount += subtotal;
      
      transactionItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      });
    }
    
    const grandTotal = calculateGrandTotal(totalAmount, discount, tax);
    
    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber(prisma);
    
    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        invoiceNumber,
        userId,
        customerName,
        totalAmount,
        discount,
        tax,
        grandTotal,
        paymentMethod: paymentMethod as any,
        paymentStatus: PaymentStatus.PENDING,
        orderType: orderType as any,
        notes: notes || null,
        items: {
          create: transactionItems,
        },
      },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    return transaction;
  },
  
  // Get all transactions
  async getAllTransactions(
    page: number = 1,
    limit: number = 10,
    filters?: {
      startDate?: Date;
      endDate?: Date;
      paymentStatus?: string;
      paymentMethod?: string;
      userId?: number;
    }
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {
      deletedAt: null,
    };
    
    if (filters?.startDate || filters?.endDate) {
      where.transactionDate = {};
      if (filters.startDate) where.transactionDate.gte = filters.startDate;
      if (filters.endDate) where.transactionDate.lte = filters.endDate;
    }
    
    if (filters?.paymentStatus) {
      where.paymentStatus = filters.paymentStatus;
    }
    
    if (filters?.paymentMethod) {
      where.paymentMethod = filters.paymentMethod;
    }
    
    if (filters?.userId) {
      where.userId = filters.userId;
    }
    
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          items: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { transactionDate: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ]);
    
    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
  
  // Get transaction by ID
  async getTransactionById(transactionId: number) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        deletedAt: null,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    return transaction;
  },
  
  // Get transaction by invoice number
  async getTransactionByInvoice(invoiceNumber: string) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        invoiceNumber,
        deletedAt: null,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    
    return transaction;
  },
  
  // Update payment status
  async updatePaymentStatus(transactionId: number, paymentStatus: string) {
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { paymentStatus: paymentStatus as any },
      include: {
        items: true,
      },
    });
    
    return transaction;
  },
  
  // Cancel transaction (soft delete)
  async cancelTransaction(transactionId: number) {
    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { deletedAt: new Date() },
    });
    
    return transaction;
  },
  
  // Get daily sales report
  async getDailySalesReport(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const transactions = await prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        paymentStatus: PaymentStatus.PAID,
        deletedAt: null,
      },
      include: {
        items: true,
      },
    });
    
    const totalSales = transactions.reduce((sum, t) => sum + Number(t.grandTotal), 0);
    const totalTransactions = transactions.length;
    const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;
    
    return {
      date: startOfDay,
      totalSales,
      totalTransactions,
      averageTransaction,
      transactions,
    };
  },
  
  // Get monthly sales report
  async getMonthlySalesReport(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    const transactions = await prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
        paymentStatus: PaymentStatus.PAID,
        deletedAt: null,
      },
      orderBy: { transactionDate: 'asc' },
    });
    
    const totalSales = transactions.reduce((sum, t) => sum + Number(t.grandTotal), 0);
    
    // Group by day
    const dailyData: any = {};
    transactions.forEach(t => {
      const day = t.transactionDate.getDate();
      if (!dailyData[day]) {
        dailyData[day] = {
          day,
          total: 0,
          count: 0,
        };
      }
      dailyData[day].total += Number(t.grandTotal);
      dailyData[day].count++;
    });
    
    return {
      year,
      month,
      totalSales,
      totalTransactions: transactions.length,
      dailyReport: Object.values(dailyData),
    };
  },
};