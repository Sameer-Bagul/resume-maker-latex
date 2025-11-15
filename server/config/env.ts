import "dotenv/config";

interface EnvConfig {
  MONGODB_URI: string;
  JWT_SECRET: string;
  PORT: number;
  NODE_ENV: string;
}

function validateEnv(): EnvConfig {
  const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
  
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is required. Please set it in your environment variables.\n" +
      "Example: mongodb+srv://username:password@cluster.mongodb.net/database"
    );
  }

  if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
    throw new Error(
      `Invalid MONGODB_URI scheme. Expected connection string to start with "mongodb://" or "mongodb+srv://"\n` +
      `Got: ${MONGODB_URI.substring(0, 20)}...\n` +
      'Please set MONGODB_URI to a valid MongoDB connection string.'
    );
  }

  const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
  
  if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'dev-secret-key-change-in-production') {
    console.warn('⚠️  WARNING: Using default JWT_SECRET in production. Please set a secure JWT_SECRET!');
  }

  const PORT = parseInt(process.env.PORT || '5000', 10);
  const NODE_ENV = process.env.NODE_ENV || 'development';

  return {
    MONGODB_URI,
    JWT_SECRET,
    PORT,
    NODE_ENV,
  };
}

export const env = validateEnv();

export default env;
