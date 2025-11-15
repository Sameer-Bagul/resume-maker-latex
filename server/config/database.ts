import mongoose from 'mongoose';
import { env } from './env';

const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  family: 4,
};

export async function connectDB(): Promise<void> {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(env.MONGODB_URI, options);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    throw error;
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('📴 Mongoose disconnected from MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📴 Mongoose connection closed through app termination');
  process.exit(0);
});

export default { connectDB };
