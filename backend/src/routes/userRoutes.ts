import express from 'express';
import { register, login } from '../controllers/userController';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

export default router;
