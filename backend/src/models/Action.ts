import mongoose, { Schema, Document } from 'mongoose';

// Action Template - predefined action types that can be applied to jobs
export interface IActionTemplate extends Document {
    name: string;
    description: string;
    category:
        | 'application'
        | 'interview'
        | 'response'
        | 'follow-up'
        | 'other';
    isDefault: boolean; // Whether this action is automatically added to new jobs
    color?: string; // For UI display
    icon?: string; // For UI display
    order: number; // For sorting in UI
}

const actionTemplateSchema = new Schema<IActionTemplate>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: [
                'application',
                'interview',
                'response',
                'follow-up',
                'other',
            ],
            required: true,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            trim: true,
        },
        icon: {
            type: String,
            trim: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Action Instance - an action template applied to a specific job
export interface IAction extends Document {
    jobId: string;
    userId: string;
    templateId: mongoose.Types.ObjectId; // Reference to ActionTemplate
    templateName: string; // Denormalized for easier queries
    date: Date;
    notes?: string;
    scheduledDate?: Date; // For future actions like interviews
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
        templateId: {
            type: Schema.Types.ObjectId,
            ref: 'ActionTemplate',
            required: true,
        },
        templateName: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        notes: {
            type: String,
            trim: true,
        },
        scheduledDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient queries
actionSchema.index({ jobId: 1, date: -1 });
actionSchema.index({ userId: 1, date: -1 });
actionSchema.index({ templateId: 1 });

export const ActionTemplate = mongoose.model<IActionTemplate>(
    'ActionTemplate',
    actionTemplateSchema
);
export const Action = mongoose.model<IAction>('Action', actionSchema);
