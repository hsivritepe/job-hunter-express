// Base user interface for general use
export interface User {
    _id?: string;
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

// Job interface
export interface Job {
    _id?: string;
    userId: string;
    title: string;
    company: string;
    location?: string;
    description?: string;
    appliedDate: Date;
    resumeLink?: string;
    jobPostingLink?: string;
    requirements: string[];
    salary?: string;
    notes?: string;
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    status: 'open' | 'closed';
    createdAt?: Date;
    updatedAt?: Date;
}
export interface Company {
    _id?: string;
    name: string;
    description?: string;
    website?: string;
    location?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Action Template interface
export interface ActionTemplate {
    _id?: string;
    name: string;
    description: string;
    category:
        | 'application'
        | 'interview'
        | 'response'
        | 'follow-up'
        | 'other';
    isDefault: boolean;
    color?: string;
    icon?: string;
    order: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Action interface
export interface Action {
    _id?: string;
    jobId: string;
    userId: string;
    templateId: string;
    templateName: string;
    date: Date;
    notes?: string;
    scheduledDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

// Application interface
export interface Application {
    _id?: string;
    jobId: string;
    userId: string;
    status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
    resume: string;
    coverLetter?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Frontend-specific types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
}

export interface UpdateProfileData {
    name?: string;
    phone?: string;
    location?: string;
    bio?: string;
    profilePicture?: string;
    socialLinks?: {
        linkedin?: string;
        github?: string;
        website?: string;
    };
}

export interface AuthResponse {
    user: UserResponse;
    token: string;
}

export interface UserState {
    user: UserResponse | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

export interface NavigationProps {
    user: UserResponse;
    onSignOut: () => void;
}
