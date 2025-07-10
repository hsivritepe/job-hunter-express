import express from 'express';
import { createJob } from '../controllers/jobController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Protected route - requires authentication
router.post('/create', auth, createJob);

export default router;
