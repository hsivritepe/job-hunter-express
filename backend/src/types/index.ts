export interface User {
    _id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
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
