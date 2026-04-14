import app from './app';
import env from './config/env';
import logger from './config/logger';
import { connectDB, prisma } from './config/database';

// Connect to database
connectDB();

// Start server
const server = app.listen(env.PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${env.PORT}`);
  console.log(`📊 Prisma Studio: npx prisma studio`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`📚 API Base URL: http://localhost:${env.PORT}${env.API_PREFIX}\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    await prisma.$disconnect();
    process.exit(0);
  });
});

export default server;