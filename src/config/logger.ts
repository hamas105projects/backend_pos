import env from './env';

interface Logger {
  info: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  http: (...args: any[]) => void;
}

const logger: Logger = {
  info: (...args: any[]) => {
    if (env.NODE_ENV !== 'test') {
      console.log(`[INFO] ${new Date().toISOString()}`, ...args);
    }
  },
  
  error: (...args: any[]) => {
    if (env.NODE_ENV !== 'test') {
      console.error(`[ERROR] ${new Date().toISOString()}`, ...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (env.NODE_ENV !== 'test') {
      console.warn(`[WARN] ${new Date().toISOString()}`, ...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (env.isDevelopment) {
      console.debug(`[DEBUG] ${new Date().toISOString()}`, ...args);
    }
  },
  
  http: (...args: any[]) => {
    if (env.isDevelopment) {
      console.log(`[HTTP] ${new Date().toISOString()}`, ...args);
    }
  },
};

export default logger;