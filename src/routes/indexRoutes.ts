import { Router } from 'express';
import userRoutes from './userRoutes';
import productRoutes from './ProductRoutes';
import transactionRoutes from './transactionRoutes';
import reportRoutes from './reportRoutes';  // <-- TAMBAH INI
import env from '../config/env';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

router.get('/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is working!',
    data: {
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    },
  });
});

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/transactions', transactionRoutes);
router.use('/reports', reportRoutes);  // <-- TAMBAH INI

export default router;