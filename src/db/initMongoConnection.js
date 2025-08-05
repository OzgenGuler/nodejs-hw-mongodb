import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { env } from '../utils/env.js';

dotenv.config();

export const initMongoConnection = async () => {
  try {
    const MONGO_USER = env('MONGO_USER');
    const MONGO_PASSWORD = env('MONGO_PASSWORD');
    const MONGO_URL = env('MONGO_URL');
    const MONGO_DB = env('MONGO_DB');
    await mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}/${MONGO_DB}?retryWrites=true&w=majority`
    );
    console.log('✅ MongoDB connection established successfully.');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
