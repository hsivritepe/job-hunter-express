import { Request, Response } from 'express';
import { Action } from '../models/Action';
import { IUser } from '../models/User';

// Extend the Request interface to include user
interface AuthenticatedRequest extends Request {
    user?: IUser;
}

export const createAction = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const {
            jobId,
            type,
            title,
            description,
            date,
            status,
            notes,
        } = req.body;

        // Get the authenticated user's ID
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                message: 'User not authenticated',
            });
        }

        const action = new Action({
            jobId,
            userId: userId.toString(),
            type,
            title,
            description,
            date: date ? new Date(date) : new Date(),
            status: status || 'pending',
            notes,
        });

        await action.save();

        res.status(201).json({
            message: 'Action created successfully',
            action,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to create action',
            error: error.message,
        });
    }
};

export const getActionsByJobId = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const { jobId } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                message: 'User not authenticated',
            });
        }

        const actions = await Action.find({
            jobId,
            userId: userId.toString(),
        }).sort({ date: -1 });

        res.status(200).json({
            message: 'Actions fetched successfully',
            actions,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to get actions',
            error: error.message,
        });
    }
};

export const getActionsByUserId = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                message: 'User not authenticated',
            });
        }

        const actions = await Action.find({
            userId: userId.toString(),
        }).sort({ date: -1 });

        res.status(200).json({
            message: 'Actions fetched successfully',
            actions,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to get actions',
            error: error.message,
        });
    }
};

export const updateAction = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                message: 'User not authenticated',
            });
        }

        const action = await Action.findOneAndUpdate(
            { _id: id, userId: userId.toString() },
            req.body,
            { new: true, runValidators: true }
        );

        if (!action) {
            return res.status(404).json({
                message: 'Action not found',
            });
        }

        res.status(200).json({
            message: 'Action updated successfully',
            action,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to update action',
            error: error.message,
        });
    }
};

export const deleteAction = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                message: 'User not authenticated',
            });
        }

        const action = await Action.findOneAndDelete({
            _id: id,
            userId: userId.toString(),
        });

        if (!action) {
            return res.status(404).json({
                message: 'Action not found',
            });
        }

        res.status(200).json({
            message: 'Action deleted successfully',
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to delete action',
            error: error.message,
        });
    }
};
