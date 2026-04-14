import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import env from './env';
import logger from './logger';

// 1. Inisialisasi PostgreSQL Pool dari library 'pg'
// Pastikan DATABASE_URL ada di file .env kamu
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Gunakan adapter agar sesuai dengan requirement Prisma 7 (Engine Type: Client)
const adapter = new PrismaPg(pool);

// 3. Create Prisma client instance dengan adapter
const prisma = new PrismaClient({
  adapter,
  log: env.isDevelopment ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
});

// Connect to database
async function connectDB(): Promise<void> {
  try {
    // Di Prisma 7 dengan adapter, $connect akan memastikan pool bisa terhubung
    await prisma.$connect();
    logger.info('✅ Database connected successfully via Adapter');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Disconnect from database
async function disconnectDB(): Promise<void> {
  try {
    await prisma.$disconnect();
    await pool.end(); // Tutup juga pool dari 'pg'
    logger.info('📴 Database disconnected');
  } catch (error) {
    logger.error('❌ Error during disconnection:', error);
  }
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await disconnectDB();
});

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

export { prisma, connectDB, disconnectDB };