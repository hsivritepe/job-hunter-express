import request from 'supertest';
import express from 'express';
import { connectTestDB, clearTestDB, closeTestDB } from '../setup';
import jobRoutes from '../../routes/jobRoutes';
import userRoutes from '../../routes/userRoutes';

// Jest globals
declare const describe: any;
declare const it: any;
declare const expect: any;
declare const beforeAll: any;
declare const afterAll: any;
declare const beforeEach: any;
declare const afterEach: any;

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);

describe('Job Controller Tests', () => {
    let authToken: string;
    let userId: string;

    beforeAll(async () => {
        await connectTestDB();
    });

    afterEach(async () => {
        await clearTestDB();
    });

    afterAll(async () => {
        await closeTestDB();
    });

    beforeEach(async () => {
        // Create a test user and get auth token
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'TestPass123',
        };

        const registerResponse = await request(app)
            .post('/api/users/register')
            .send(userData);

        // Check if registration was successful
        if (registerResponse.status !== 201) {
            console.error(
                'Registration failed:',
                registerResponse.body
            );
            throw new Error('User registration failed in test setup');
        }

        authToken = registerResponse.body.token;
        userId = registerResponse.body.user._id;
    });

    describe('POST /api/jobs/create', () => {
        it('should create a new job with valid data', async () => {
            const jobData = {
                title: 'Software Engineer',
                company: 'Tech Corp',
                location: 'San Francisco, CA',
                description: 'Full-stack development role',
                requirements: ['JavaScript', 'React', 'Node.js'],
                salary: {
                    min: 80000,
                    max: 120000,
                    currency: 'USD',
                },
                type: 'full-time',
                status: 'open',
            };

            const response = await request(app)
                .post('/api/jobs/create')
                .set('Authorization', `Bearer ${authToken}`)
                .send(jobData)
                .expect(201);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('job');
            expect(response.body.message).toBe(
                'Job created successfully'
            );
            expect(response.body.job.title).toBe(jobData.title);
            expect(response.body.job.company).toBe(jobData.company);
            expect(response.body.job.userId).toBe(userId);
            expect(response.body.job.requirements).toEqual(
                jobData.requirements
            );
            expect(response.body.job.salary).toEqual(jobData.salary);
        });

        it('should create a job with minimal required data', async () => {
            const jobData = {
                title: 'Developer',
                company: 'Startup Inc',
                location: 'Remote',
                description: 'Remote development position',
            };

            const response = await request(app)
                .post('/api/jobs/create')
                .set('Authorization', `Bearer ${authToken}`)
                .send(jobData)
                .expect(201);

            expect(response.body.job.title).toBe(jobData.title);
            expect(response.body.job.company).toBe(jobData.company);
            expect(response.body.job.type).toBe('full-time'); // Default value
            expect(response.body.job.status).toBe('open'); // Default value
            expect(response.body.job.requirements).toEqual([]); // Default empty array
        });

        it('should not create job without authentication', async () => {
            const jobData = {
                title: 'Software Engineer',
                company: 'Tech Corp',
                location: 'San Francisco, CA',
                description: 'Full-stack development role',
            };

            const response = await request(app)
                .post('/api/jobs/create')
                .send(jobData)
                .expect(401);

            expect(response.body.error).toBe('Please authenticate.');
        });

        it('should not create job with missing required fields', async () => {
            const jobData = {
                company: 'Tech Corp',
                location: 'San Francisco, CA',
                // Missing title and description
            };

            const response = await request(app)
                .post('/api/jobs/create')
                .set('Authorization', `Bearer ${authToken}`)
                .send(jobData)
                .expect(400);

            expect(response.body.message).toBe(
                'Failed to create job'
            );
        });

        it('should create job with custom requirements array', async () => {
            const jobData = {
                title: 'Frontend Developer',
                company: 'Design Studio',
                location: 'New York, NY',
                description: 'Frontend development role',
                requirements: ['React', 'TypeScript', 'CSS', 'HTML'],
            };

            const response = await request(app)
                .post('/api/jobs/create')
                .set('Authorization', `Bearer ${authToken}`)
                .send(jobData)
                .expect(201);

            expect(response.body.job.requirements).toEqual(
                jobData.requirements
            );
        });
    });

    describe('GET /api/jobs', () => {
        beforeEach(async () => {
            // Create some test jobs
            const jobs = [
                {
                    title: 'Software Engineer',
                    company: 'Tech Corp',
                    location: 'San Francisco, CA',
                    description: 'Full-stack development role',
                    requirements: ['JavaScript', 'React'],
                },
                {
                    title: 'Frontend Developer',
                    company: 'Design Studio',
                    location: 'New York, NY',
                    description: 'Frontend development role',
                    requirements: ['React', 'TypeScript'],
                },
                {
                    title: 'Backend Developer',
                    company: 'API Company',
                    location: 'Remote',
                    description: 'Backend development role',
                    requirements: ['Node.js', 'MongoDB'],
                },
            ];

            for (const job of jobs) {
                await request(app)
                    .post('/api/jobs/create')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(job);
            }
        });

        it('should get all jobs for authenticated user', async () => {
            const response = await request(app)
                .get('/api/jobs')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('jobs');
            expect(response.body.message).toBe(
                'Jobs fetched successfully'
            );
            expect(response.body.jobs).toHaveLength(3);
            expect(response.body.jobs[0]).toHaveProperty('title');
            expect(response.body.jobs[0]).toHaveProperty('company');
            expect(response.body.jobs[0]).toHaveProperty('userId');
            expect(response.body.jobs[0].userId).toBe(userId);
        });

        it('should not get jobs without authentication', async () => {
            const response = await request(app)
                .get('/api/jobs')
                .expect(401);

            expect(response.body.error).toBe('Please authenticate.');
        });

        it('should return empty array when user has no jobs', async () => {
            // Clear the database
            await clearTestDB();

            // Create a new user
            const userData = {
                name: 'New User',
                email: 'newuser@example.com',
                password: 'TestPass123',
            };

            const registerResponse = await request(app)
                .post('/api/users/register')
                .send(userData);

            const newAuthToken = registerResponse.body.token;

            const response = await request(app)
                .get('/api/jobs')
                .set('Authorization', `Bearer ${newAuthToken}`)
                .expect(200);

            expect(response.body.jobs).toHaveLength(0);
            expect(response.body.message).toBe(
                'Jobs fetched successfully'
            );
        });
    });

    describe('GET /api/jobs/:id', () => {
        let jobId: string;

        beforeEach(async () => {
            // Create a test job
            const jobData = {
                title: 'Software Engineer',
                company: 'Tech Corp',
                location: 'San Francisco, CA',
                description: 'Full-stack development role',
                requirements: ['JavaScript', 'React'],
            };

            const createResponse = await request(app)
                .post('/api/jobs/create')
                .set('Authorization', `Bearer ${authToken}`)
                .send(jobData);

            jobId = createResponse.body.job._id;
        });

        it('should get job by ID', async () => {
            const response = await request(app)
                .get(`/api/jobs/${jobId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('job');
            expect(response.body.message).toBe(
                'Job fetched successfully'
            );
            expect(response.body.job._id).toBe(jobId);
            expect(response.body.job.title).toBe('Software Engineer');
            expect(response.body.job.company).toBe('Tech Corp');
        });

        it('should return 404 for non-existent job ID', async () => {
            const fakeJobId = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId format

            const response = await request(app)
                .get(`/api/jobs/${fakeJobId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);

            expect(response.body.message).toBe('Job not found');
        });

        it('should return 400 for invalid job ID format', async () => {
            const invalidJobId = 'invalid-id';

            const response = await request(app)
                .get(`/api/jobs/${invalidJobId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(400);

            expect(response.body.message).toBe('Failed to get job');
        });
    });

    describe('Job data validation', () => {
        it('should validate job type enum values', async () => {
            const jobData = {
                title: 'Developer',
                company: 'Tech Corp',
                location: 'Remote',
                description: 'Development role',
                type: 'invalid-type', // Invalid type
            };

            const response = await request(app)
                .post('/api/jobs/create')
                .set('Authorization', `Bearer ${authToken}`)
                .send(jobData)
                .expect(400);

            expect(response.body.message).toBe(
                'Failed to create job'
            );
        });

        it('should validate job status enum values', async () => {
            const jobData = {
                title: 'Developer',
                company: 'Tech Corp',
                location: 'Remote',
                description: 'Development role',
                status: 'invalid-status', // Invalid status
            };

            const response = await request(app)
                .post('/api/jobs/create')
                .set('Authorization', `Bearer ${authToken}`)
                .send(jobData)
                .expect(400);

            expect(response.body.message).toBe(
                'Failed to create job'
            );
        });

        it('should accept valid job type values', async () => {
            const validTypes = [
                'full-time',
                'part-time',
                'contract',
                'internship',
            ];

            for (const type of validTypes) {
                const jobData = {
                    title: `Developer - ${type}`,
                    company: 'Tech Corp',
                    location: 'Remote',
                    description: 'Development role',
                    type: type,
                };

                const response = await request(app)
                    .post('/api/jobs/create')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(jobData)
                    .expect(201);

                expect(response.body.job.type).toBe(type);
            }
        });

        it('should accept valid job status values', async () => {
            const validStatuses = ['open', 'closed'];

            for (const status of validStatuses) {
                const jobData = {
                    title: `Developer - ${status}`,
                    company: 'Tech Corp',
                    location: 'Remote',
                    description: 'Development role',
                    status: status,
                };

                const response = await request(app)
                    .post('/api/jobs/create')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(jobData)
                    .expect(201);

                expect(response.body.job.status).toBe(status);
            }
        });
    });
});
