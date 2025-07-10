import request from 'supertest';
import express from 'express';
import { connectTestDB, clearTestDB, closeTestDB } from '../setup';
import jobRoutes from '../../routes/jobRoutes';
import { User } from '../../models/User';
import jwt from 'jsonwebtoken';

// Jest globals
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const beforeAll: any;
declare const afterEach: any;
declare const afterAll: any;

const app = express();
app.use(express.json());
app.use('/api/jobs', jobRoutes);

// Helper function to generate token
const generateToken = async () => {
    const user = new User({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
    });
    await user.save();

    return jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );
};

describe('Job Controller Tests', () => {
    beforeAll(async () => {
        await connectTestDB();
    });

    afterEach(async () => {
        await clearTestDB();
    });

    afterAll(async () => {
        await closeTestDB();
    });

    describe('Create Job', () => {
        it('should create a new job', async () => {
            const token = await generateToken();
            const response = await request(app)
                .post('/api/jobs/create')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Test Job',
                    description: 'Test Description',
                    company: 'Test Company',
                    location: 'Test Location',
                    salary: {
                        min: 80000,
                        max: 120000,
                        currency: 'USD',
                    },
                })
                .expect(201);
            expect(response.body.message).toBe(
                'Job created successfully'
            );
            expect(response.body.job.title).toBe('Test Job');
            expect(response.body.job.description).toBe(
                'Test Description'
            );
            expect(response.body.job.company).toBe('Test Company');
            expect(response.body.job.location).toBe('Test Location');
            expect(response.body.job.salary.min).toBe(80000);
            expect(response.body.job.salary.max).toBe(120000);
            expect(response.body.job.salary.currency).toBe('USD');
        });

        it('should not create a job with missing required fields', async () => {
            const token = await generateToken();
            const response = await request(app)
                .post('/api/jobs/create')
                .set('Authorization', `Bearer ${token}`)
                .send({});
            expect(response.status).toBe(400);
        });

        it('should not create a job without authentication', async () => {
            const response = await request(app)
                .post('/api/jobs/create')
                .send({
                    title: 'Test Job',
                    description: 'Test Description',
                    company: 'Test Company',
                    location: 'Test Location',
                });
            expect(response.status).toBe(401);
        });
    });
});
