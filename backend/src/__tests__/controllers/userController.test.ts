import request from 'supertest';
import express from 'express';
import { connectTestDB, clearTestDB, closeTestDB } from '../setup';
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

describe('User Controller Tests', () => {
    beforeAll(async () => {
        await connectTestDB();
    });

    afterEach(async () => {
        await clearTestDB();
    });

    afterAll(async () => {
        await closeTestDB();
    });

    describe('POST /api/users/register', () => {
        it('should register a new user with valid data', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'TestPass123',
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(userData)
                .expect(201);

            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe(userData.email);
            expect(response.body.user.name).toBe(userData.name);
            expect(response.body.user.password).not.toBe(
                userData.password
            ); // Should be hashed
        });

        it('should not register user with invalid email', async () => {
            const userData = {
                name: 'Test User',
                email: 'invalid-email',
                password: 'TestPass123',
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(userData)
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
            expect(response.body.details).toHaveLength(1);
            expect(response.body.details[0].path).toContain('email');
        });

        it('should not register user with weak password', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'weak',
            };

            const response = await request(app)
                .post('/api/users/register')
                .send(userData)
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
            expect(response.body.details).toHaveLength(2); // Length and regex validation
        });

        it('should not register user with duplicate email', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'TestPass123',
            };

            // Register first user
            await request(app)
                .post('/api/users/register')
                .send(userData)
                .expect(201);

            // Try to register with same email
            const response = await request(app)
                .post('/api/users/register')
                .send(userData)
                .expect(400);

            expect(response.body.error).toBe(
                'Email already registered'
            );
        });
    });

    describe('POST /api/users/login', () => {
        beforeEach(async () => {
            // Create a test user
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'TestPass123',
            };
            await request(app)
                .post('/api/users/register')
                .send(userData);
        });

        it('should login with valid credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'TestPass123',
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData)
                .expect(200);

            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe(loginData.email);
        });

        it('should not login with invalid email', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'TestPass123',
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData)
                .expect(401);

            expect(response.body.error).toBe('Invalid credentials');
        });

        it('should not login with invalid password', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'WrongPassword123',
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData)
                .expect(401);

            expect(response.body.error).toBe('Invalid credentials');
        });

        it('should not login with invalid email format', async () => {
            const loginData = {
                email: 'invalid-email',
                password: 'TestPass123',
            };

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData)
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
        });
    });

    describe('POST /api/users/forgot-password', () => {
        beforeEach(async () => {
            // Create a test user
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'TestPass123',
            };
            await request(app)
                .post('/api/users/register')
                .send(userData);
        });

        it('should generate reset token for existing user', async () => {
            const response = await request(app)
                .post('/api/users/forgot-password')
                .send({ email: 'test@example.com' })
                .expect(200);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('resetToken');
            expect(response.body.message).toBe(
                'Password reset token generated'
            );
        });

        it('should not generate token for non-existent user', async () => {
            const response = await request(app)
                .post('/api/users/forgot-password')
                .send({ email: 'nonexistent@example.com' })
                .expect(404);

            expect(response.body.error).toBe('User not found');
        });

        it('should not accept invalid email format', async () => {
            const response = await request(app)
                .post('/api/users/forgot-password')
                .send({ email: 'invalid-email' })
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
        });
    });

    describe('POST /api/users/reset-password', () => {
        let resetToken: string;

        beforeEach(async () => {
            // Create a test user and generate reset token
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'TestPass123',
            };
            await request(app)
                .post('/api/users/register')
                .send(userData);

            const forgotResponse = await request(app)
                .post('/api/users/forgot-password')
                .send({ email: 'test@example.com' });

            resetToken = forgotResponse.body.resetToken;
        });

        it('should reset password with valid token', async () => {
            const response = await request(app)
                .post('/api/users/reset-password')
                .send({
                    token: resetToken,
                    newPassword: 'NewPass123',
                })
                .expect(200);

            expect(response.body.message).toBe(
                'Password reset successful'
            );
        });

        it('should not reset password with invalid token', async () => {
            const response = await request(app)
                .post('/api/users/reset-password')
                .send({
                    token: 'invalid-token',
                    newPassword: 'NewPass123',
                })
                .expect(400);

            expect(response.body.error).toBe(
                'Invalid or expired reset token'
            );
        });

        it('should not accept weak new password', async () => {
            const response = await request(app)
                .post('/api/users/reset-password')
                .send({
                    token: resetToken,
                    newPassword: 'weak',
                })
                .expect(400);

            expect(response.body.error).toBe('Validation failed');
        });
    });
});
