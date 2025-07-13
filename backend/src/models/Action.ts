import mongoose, { Schema, Document } from 'mongoose';

export interface IAction extends Document {
    jobId: string;
    userId: string;
    type:
        | 'follow-up'
        | 'phone-interview'
        | 'coding-interview'
        | 'onsite-interview'
        | 'offer'
        | 'rejected'
        | 'accepted'
        | 'declined'
        | 'withdrawn'
        | 'other';
    title: string;
    description?: string;
    date: Date;
    status: 'pending' | 'completed' | 'cancelled';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const actionSchema = new Schema<IAction>(
    {
        jobId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: [
                'follow-up',
                'phone-interview',
                'coding-interview',
                'onsite-interview',
                'offer',
                'rejected',
                'accepted',
                'declined',
                'withdrawn',
                'other',
            ],
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: false,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled'],
            default: 'pending',
        },
        notes: {
            type: String,
            required: false,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
actionSchema.index({ jobId: 1, date: -1 });
actionSchema.index({ userId: 1, date: -1 });

export const Action = mongoose.model<IAction>('Action', actionSchema);
