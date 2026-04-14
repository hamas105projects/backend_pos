import { Router } from 'express';
import { transactionController } from '../controllers/transactionController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// All transaction routes require authentication
router.use(authenticate);

// Transaction CRUD
router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getAllTransactions);
router.get('/invoice/:invoiceNumber', transactionController.getTransactionByInvoice);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id/payment-status', authorize('admin'), transactionController.updatePaymentStatus);
router.delete('/:id/cancel', transactionController.cancelTransaction);

// Reports (admin only)
router.get('/reports/daily', authorize('admin'), transactionController.getDailySalesReport);
router.get('/reports/monthly', authorize('admin'), transactionController.getMonthlySalesReport);

export default router;