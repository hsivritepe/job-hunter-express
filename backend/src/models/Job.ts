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
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        requirements: [
            {
                type: String,
                trim: true,
            },
        ],
        salary: {
            min: {
                type: Number,
                required: false,
            },
            max: {
                type: Number,
                required: false,
            },
            currency: {
                type: String,
                default: 'USD',
            },
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
