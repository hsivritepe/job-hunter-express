import express from 'express';
import {
    register,
    login,
    changePassword,
    updateUser,
    updateProfile,
    getProfile,
    forgotPassword,
    resetPassword,
} from '../controllers/userController';
import { validateRequest } from '../middleware/validateRequest';
import {
    registerSchema,
    loginSchema,
    changePasswordSchema,
    updateUserSchema,
    updateUserBasicSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from '../validations/authValidation';
import { auth } from '../middleware/auth';

const router = express.Router();

// Auth routes with validation
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

// Protected routes (require authentication)
router.put(
    '/change-password',
    auth,
    validateRequest(changePasswordSchema),
    changePassword
);
router.get('/profile', auth, getProfile);
router.put(
    '/profile',
    auth,
    validateRequest(updateUserSchema),
    updateProfile
);
router.put(
    '/update',
    auth,
    validateRequest(updateUserBasicSchema),
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
