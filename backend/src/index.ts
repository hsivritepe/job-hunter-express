import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import jobRoutes from './routes/jobRoutes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
    .connect(
        process.env.MONGODB_URI ||
            'mongodb://localhost:27017/job-hunter'
    )
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Job Hunter API' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
