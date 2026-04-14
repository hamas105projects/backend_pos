import { Router } from 'express';
import userRoutes from './userRoutes';
import productRoutes from './ProductRoutes';
import transactionRoutes from './transactionRoutes';
import env from '../config/env';

const router = Router();

// Health check for API
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Test route
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

// Register all routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/transactions', transactionRoutes);

export default router;