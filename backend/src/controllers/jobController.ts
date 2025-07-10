import { Request, Response } from 'express';
import { Job } from '../models/Job';
import { Job as JobType } from '../types';
import { IUser } from '../models/User';

// Extend the Request interface to include user
interface AuthenticatedRequest extends Request {
    user?: IUser;
}

export const createJob = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const {
            title,
            description,
            company,
            location,
            salary,
            requirements,
            type,
            status,
        } = req.body;

        // Get the authenticated user's ID
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                message: 'User not authenticated',
            });
        }

        const job = new Job({
            userId: userId.toString(), // Convert ObjectId to string
            title,
            description,
            company,
            location,
            salary,
            requirements: requirements || [],
            type: type || 'full-time',
            status: status || 'open',
        });

        await job.save();

        res.status(201).json({
            message: 'Job created successfully',
            job,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to create job',
            error: error.message,
        });
    }
};

export const getJobs = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const jobs = await Job.find({ userId: req.user?._id });
        res.status(200).json({
            message: 'Jobs fetched successfully',
            jobs,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to get jobs',
            error: error.message,
        });
    }
};
