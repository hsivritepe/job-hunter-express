import { Request, Response } from 'express';
import { Job } from '../models/Job';
import { Job as JobInterface } from '../types';
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
            appliedDate,
            resumeLink,
            jobPostingLink,
            salary,
            requirements,
            notes,
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
            appliedDate: appliedDate
                ? new Date(appliedDate)
                : new Date(),
            resumeLink,
            jobPostingLink,
            salary,
            requirements: requirements || [],
            notes,
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

export const getJobById = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id);

        if (!job) {
            return res.status(404).json({
                message: 'Job not found',
            });
        }

        res.status(200).json({
            message: 'Job fetched successfully',
            job,
        });
    } catch (error: any) {
        res.status(400).json({
            message: 'Failed to get job',
            error: error.message,
        });
    }
};
