import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User as UserType } from '../types';

// Extend the User interface to include Mongoose Document methods and our custom methods
export interface IUser
    extends Omit<UserType, '_id' | 'createdAt' | 'updatedAt'>,
        Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        resetToken: {
            type: String,
        },
        resetTokenExpiry: {
            type: Date,
        },
        phone: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        bio: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        profilePicture: {
            type: String,
        },
        socialLinks: {
            linkedin: {
                type: String,
                trim: true,
            },
            github: {
                type: String,
                trim: true,
            },
            website: {
                type: String,
                trim: true,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
