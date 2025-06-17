import express from 'express';
import {
    register,
    login,
    changePassword,
    updateUser,
    forgotPassword,
    resetPassword,
} from '../controllers/userController';
import { validateRequest } from '../middleware/validateRequest';
import {
    registerSchema,
    loginSchema,
    changePasswordSchema,
    updateUserSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from '../validations/authValidation';
import { auth } from '../middleware/auth';

const router = express.Router();

// Auth routes with validation
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

// Protected routes (require authentication)
router.post(
    '/change-password',
    auth,
    validateRequest(changePasswordSchema),
    changePassword
);
router.put(
    '/update',
    auth,
    validateRequest(updateUserSchema),
    updateUser
);

// Password reset routes
router.post(
    '/forgot-password',
    validateRequest(forgotPasswordSchema),
    forgotPassword
);
router.post(
    '/reset-password',
    validateRequest(resetPasswordSchema),
    resetPassword
);

export default router;
