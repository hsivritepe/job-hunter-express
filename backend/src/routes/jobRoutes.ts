import express from 'express';
import {
    createJob,
    getJobs,
    getJobById,
} from '../controllers/jobController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Protected route - requires authentication
router.post('/create', auth, createJob);

router.get('/', auth, getJobs);
router.get('/:id', auth, getJobById);

export default router;
