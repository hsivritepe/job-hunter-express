import express from 'express';
import {
    createAction,
    getActionsByJobId,
    getActionsByUserId,
    updateAction,
    deleteAction,
} from '../controllers/actionController';
import { auth } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create a new action
router.post('/', createAction);

// Get all actions for a specific job
router.get('/job/:jobId', getActionsByJobId);

// Get all actions for the authenticated user
router.get('/user', getActionsByUserId);

// Update an action
router.put('/:id', updateAction);

// Delete an action
router.delete('/:id', deleteAction);

export default router;
