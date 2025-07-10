// Base user interface for general use
export interface User {
    _id?: string; // Make _id optional to avoid conflicts with Mongoose Document
    email: string;
    password: string;
    name: string;
    resetToken?: string;
    resetTokenExpiry?: Date;
    phone?: string;
    location?: string;
    bio?: string;
    profilePicture?: string;
    socialLinks?: {
        linkedin?: string;
        github?: string;
        website?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

// Interface for API responses (without password)
export interface UserResponse
    extends Omit<
        User,
        'password' | 'resetToken' | 'resetTokenExpiry'
    > {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

// Interface for user input (when creating/updating users)
export interface UserInput
    extends Omit<User, '_id' | 'createdAt' | 'updatedAt'> {
    email: string;
    password: string;
    name: string;
}

export interface Job {
    _id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    salary?: {
        min: number;
        max: number;
        currency: string;
    };
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    status: 'open' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}

export interface Application {
    _id: string;
    jobId: string;
    userId: string;
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    resume: string;
    coverLetter?: string;
    createdAt: Date;
    updatedAt: Date;
}
