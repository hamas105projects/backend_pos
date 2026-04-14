import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import env from './config/env';
import logger from './config/logger';
import { prisma } from './config/database';
import routes from './routes/indexRoutes';  // ← ubah import ini

const app: Application = express();

// Middleware
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    environment: env.NODE_ENV,
    message: 'POS System API is running'
  });
});

// Test database
app.get('/test-db', async (req: Request, res: Response) => {
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    res.json({
      success: true,
      users: userCount,
      products: productCount,
      message: 'Database connection successful'
    });
  } catch (error) {
    logger.error('Database test failed:', error);
    res.status(500).json({
      success: false,
      error: String(error),
      message: 'Database connection failed'
    });
  }
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Backend POS API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      testDb: 'GET /test-db',
      api: `${env.API_PREFIX}`,
    },
  });
});

// API Routes
app.use(env.API_PREFIX, routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot find ${req.method} ${req.url}`,
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      status: 'error',
      message: getPrismaErrorMessage(err),
    });
  }
  
  res.status(err.status || 500).json({
    status: 'error',
    message: env.isDevelopment ? err.message : 'Internal server error',
    ...(env.isDevelopment && { stack: err.stack }),
  });
});

function getPrismaErrorMessage(err: any): string {
  const errorMessages: Record<string, string> = {
    P2002: `Unique constraint failed on the field: ${err.meta?.target?.join(', ')}`,
    P2003: 'Foreign key constraint failed',
    P2025: 'Record not found',
  };
  return errorMessages[err.code] || `Database error: ${err.message}`;
}

export default app;