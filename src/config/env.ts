import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Required environment variables
const requiredEnvVars = ['DATABASE_URL', 'PORT', 'JWT_SECRET'];

// Environment configuration interface
interface EnvConfig {
  DATABASE_URL: string;
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  BCRYPT_ROUNDS: number;
  CORS_ORIGIN: string;
  API_PREFIX: string;
  MAX_FILE_SIZE: number;
  UPLOAD_DIR: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

// Build config
const envConfig: EnvConfig = {
  DATABASE_URL: process.env.DATABASE_URL as string,
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  API_PREFIX: process.env.API_PREFIX || '/api/v1',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads/products',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

// Validate environment variables
function validateEnv(): void {
  const missingVars = requiredEnvVars.filter(varName => !envConfig[varName as keyof EnvConfig]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease check your .env file');
    process.exit(1);
  }

  // Validate JWT_SECRET length (error for security)
  if (envConfig.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long');
    process.exit(1);
  }

  // Validate PORT
  if (isNaN(envConfig.PORT) || envConfig.PORT < 1 || envConfig.PORT > 65535) {
    console.error('❌ Invalid PORT number');
    process.exit(1);
  }

  console.log('✅ Environment variables validated');
  console.log(`📦 NODE_ENV: ${envConfig.NODE_ENV}`);
  console.log(`🚪 PORT: ${envConfig.PORT}`);
}

validateEnv();

export default envConfig;