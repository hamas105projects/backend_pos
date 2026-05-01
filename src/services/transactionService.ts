import { prisma } from '../config/database';
import { generateInvoiceNumber } from '../utils/generateInvoice';
import { calculateSubtotal, calculateGrandTotal } from '../utils/calculatePrice';
import { PaymentStatus } from '../constanta/enum';

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
      });
    }
    
    const grandTotal = calculateGrandTotal(totalAmount, discount, tax);
    const invoiceNumber = await generateInvoiceNumber(prisma);
    
    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        invoiceNumber,
        user: { connect: { id: userId } },
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
  
  // Get all transactions with flexible filters
  async getAllTransactions(
    page: number = 1,
    limit: number = 10,
    filters?: {
      startDate?: string;  // Changed to string for easier frontend integration
      endDate?: string;    // Changed to string for easier frontend integration
      paymentStatus?: string;
      paymentMethod?: string;
      orderType?: string;   // Added orderType filter
      userId?: number;
    }
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {
      deletedAt: null,
    };
    
    // Handle date filters (flexible: can have start only, end only, or both)
    if (filters?.startDate || filters?.endDate) {
      where.transactionDate = {};
      
      if (filters.startDate) {
        // Set to start of day
        const startDateTime = new Date(filters.startDate);
        startDateTime.setHours(0, 0, 0, 0);
        where.transactionDate.gte = startDateTime;
      }
      
      if (filters.endDate) {
        // Set to end of day
        const endDateTime = new Date(filters.endDate);
        endDateTime.setHours(23, 59, 59, 999);
        where.transactionDate.lte = endDateTime;
      }
    }
    
    // Filter by payment status
    if (filters?.paymentStatus && filters.paymentStatus !== '') {
      where.paymentStatus = filters.paymentStatus;
    }
    
    // Filter by payment method
    if (filters?.paymentMethod && filters.paymentMethod !== '') {
      where.paymentMethod = filters.paymentMethod;
    }
    
    // Filter by order type
    if (filters?.orderType && filters.orderType !== '') {
      where.orderType = filters.orderType;
    }
    
    // Filter by user ID (for employee role)
    if (filters?.userId && filters.userId > 0) {
      where.userId = filters.userId;
    }
    
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                }
              }
            }
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
        skip,
        take: limit,
        orderBy: { transactionDate: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ]);
    
    // Format transactions for frontend
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      invoiceNumber: transaction.invoiceNumber,
      transactionDate: transaction.transactionDate,
      customerName: transaction.customerName,
      orderType: transaction.orderType,
      paymentMethod: transaction.paymentMethod,
      paymentStatus: transaction.paymentStatus,
      totalAmount: transaction.totalAmount,
      discount: transaction.discount,
      tax: transaction.tax,
      grandTotal: transaction.grandTotal,
      notes: transaction.notes,
      userId: transaction.userId,
      cashierName: transaction.user?.name || '-',
      items: transaction.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * Number(item.unitPrice)
      }))
    }));
    
    return {
      success: true,
      data: formattedTransactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      filters: {
        startDate: filters?.startDate || null,
        endDate: filters?.endDate || null,
        paymentStatus: filters?.paymentStatus || null,
        paymentMethod: filters?.paymentMethod || null,
        orderType: filters?.orderType || null,
        userId: filters?.userId || null
      }
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
};