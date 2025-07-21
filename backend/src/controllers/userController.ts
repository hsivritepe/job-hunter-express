import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, IUser } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ error: 'Email already registered' });
        }

        // Create new user
        const user = new User({
            email,
            password,
            name,
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: 'Error creating user' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({ user, token });
    } catch (error) {
        res.status(400).json({ error: 'Error logging in' });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = (req as AuthenticatedRequest).user; // Type assertion after middleware

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res
                .status(400)
                .json({ error: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch {
        res.status(400).json({ error: 'Error changing password' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { name, email } = req.body;
        const user = (req as AuthenticatedRequest).user; // Type assertion after middleware

        // check if new email is already taken
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res
                    .status(400)
                    .json({ error: 'Email already registered.' });
            }
        }

        // Update user info
        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();

        res.json({ user });
    } catch {
        res.status(400).json({ error: 'Error updating user' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const {
            name,
            phone,
            location,
            bio,
            profilePicture,
            socialLinks,
        } = req.body;
        const user = (req as AuthenticatedRequest).user; // Type assertion after middleware

        // Update profile fields
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (location !== undefined) user.location = location;
        if (bio !== undefined) user.bio = bio;
        if (profilePicture !== undefined)
            user.profilePicture = profilePicture;
        if (socialLinks) {
            user.socialLinks = {
                ...user.socialLinks,
                ...socialLinks,
            };
        }

        await user.save();

        res.json({ user });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(400).json({ error: 'Error updating profile' });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = (req as AuthenticatedRequest).user; // Type assertion after middleware
        const userId = user._id;

        if (!userId) {
            return res
                .status(401)
                .json({ error: 'User not authenticated' });
        }

        const userDoc = await User.findById(userId);
        if (!userDoc) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: userDoc });
    } catch (error) {
        console.error('Profile retrieval error:', error);
        res.status(400).json({ error: 'Error retrieving profile' });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        res.json({
            message: 'Password reset token generated',
            resetToken,
        });
    } catch (error) {
        res.status(400).json({
            error: 'Error generating reset token',
        });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res
                .status(400)
                .json({ error: 'Invalid or expired reset token' });
        }

        // Update password and clear reset token
        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error resetting password' });
    }
};
