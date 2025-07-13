import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

// Type-safe authenticated request interface
export interface AuthenticatedRequest extends Request {
    user: IUser; // Make user required, not optional
}

export const auth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req
            .header('Authorization')
            ?.replace('Bearer ', '');

        if (!token) {
            return res
                .status(401)
                .json({ error: 'Access token required' });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key'
        ) as { _id: string };

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Type assertion to add user to request
        (req as AuthenticatedRequest).user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(401).json({ error: 'Authentication failed' });
    }
};

// Helper function to ensure user ownership (for resources that belong to users)
export const requireOwnership = (
    resourceUserId: string,
    user: IUser
) => {
    if (resourceUserId !== user._id?.toString()) {
        throw new Error(
            'Access denied: You can only access your own resources'
        );
    }
};
