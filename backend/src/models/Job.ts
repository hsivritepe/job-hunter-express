import mongoose, { Schema, Document } from 'mongoose';
import { Job as JobInterface } from '../types';

export interface IJob
    extends Omit<JobInterface, '_id' | 'createdAt' | 'updatedAt'>,
        Document {}

const jobSchema = new Schema<IJob>(
    {
        userId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        company: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: false,
            trim: true,
        },
        description: {
            type: String,
            required: false,
            trim: true,
        },
        appliedDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        resumeLink: {
            type: String,
            required: false,
            trim: true,
        },
        jobPostingLink: {
            type: String,
            required: false,
            trim: true,
        },
        requirements: [
            {
                type: String,
                trim: true,
            },
        ],
        salary: {
            type: String,
            required: false,
            trim: true,
        },
        notes: {
            type: String,
            required: false,
            trim: true,
        },
        type: {
            type: String,
            enum: [
                'full-time',
                'part-time',
                'contract',
                'internship',
            ],
            default: 'full-time',
        },
        status: {
            type: String,
            enum: ['open', 'closed'],
            default: 'open',
        },
    },
    {
        timestamps: true,
    }
);

export const Job = mongoose.model<IJob>('Job', jobSchema);
