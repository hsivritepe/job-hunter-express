import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Test database connection
export const connectTestDB = async (): Promise<void> => {
    const testMongoUri =
        process.env.MONGODB_URI ||
        'mongodb://localhost:27017/job-hunter-test';
    await mongoose.connect(testMongoUri);
};

// Clear database
export const clearTestDB = async (): Promise<void> => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};

// Close database connection
export const closeTestDB = async (): Promise<void> => {
    await mongoose.connection.close();
};
