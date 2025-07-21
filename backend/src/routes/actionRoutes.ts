import express from 'express';
import {
    // Action Template routes
    createActionTemplate,
    getActionTemplates,
    updateActionTemplate,
    deleteActionTemplate,
    // Action Instance routes
    createAction,
    getActionsByJobId,
    getActionsByUserId,
    updateAction,
    deleteAction,
} from '../controllers/actionController';
import { validateRequest } from '../middleware/validateRequest';
import { auth } from '../middleware/auth';

const router = express.Router();

// Action Template routes (admin/management)
router.post('/templates', auth, createActionTemplate);
router.get('/templates', getActionTemplates); // Public - no auth needed
router.put('/templates/:id', auth, updateActionTemplate);
router.delete('/templates/:id', auth, deleteActionTemplate);

// Action Instance routes (user actions)
router.post('/', auth, createAction);
router.get('/job/:jobId', auth, getActionsByJobId);
router.get('/user', auth, getActionsByUserId);
router.put('/:id', auth, updateAction);
router.delete('/:id', auth, deleteAction);

export default router;
