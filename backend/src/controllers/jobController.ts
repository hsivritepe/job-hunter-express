import { Request, Response } from 'express';
import { Job } from '../models/Job';
import {
    AuthenticatedRequest,
    requireOwnership,
} from '../middleware/auth';

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

        const job = new Job({
            userId: req.user._id?.toString() || '', // No need to check - middleware guarantees user exists
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
        const jobs = await Job.find({
            userId: req.user._id?.toString(),
        }); // No need to check - middleware guarantees user exists
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

        // Ensure user can only access their own jobs
        requireOwnership(job.userId, req.user);

        res.status(200).json({
            message: 'Job fetched successfully',
            job,
        });
    } catch (error: any) {
        if (error.message.includes('Access denied')) {
            return res.status(403).json({
                message:
                    'Access denied: You can only access your own jobs',
            });
        }
        res.status(400).json({
            message: 'Failed to get job',
            error: error.message,
        });
    }
};
