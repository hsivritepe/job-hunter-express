import { z } from 'zod';

// Registration validation schema
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must be less than 20 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

// Login validation schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Profile update validation schema
export const updateUserSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    bio: z
        .string()
        .max(500, 'Bio must be less than 500 characters')
        .optional(),
    profilePicture: z.string().url('Invalid URL').optional(),
    socialLinks: z
        .object({
            linkedin: z
                .string()
                .url('Invalid LinkedIn URL')
                .optional(),
            github: z.string().url('Invalid GitHub URL').optional(),
            website: z.string().url('Invalid website URL').optional(),
        })
        .optional(),
});

// Change password validation schema
export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, 'Current password is required'),
    newPassword: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must be less than 20 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
});

// Update user validation schema (basic info)
export const updateUserBasicSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .optional(),
    email: z.string().email('Invalid email address').optional(),
});

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

// Reset password validation schema
export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password must be less than 20 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
});

// Type inference
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<
    typeof changePasswordSchema
>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ForgotPasswordInput = z.infer<
    typeof forgotPasswordSchema
>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
