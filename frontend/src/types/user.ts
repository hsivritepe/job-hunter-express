// User related types

export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    bio?: string;
    profilePicture?: string;
    socialLinks?: {
        linkedin?: string;
        github?: string;
        website?: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface UserProfile extends User {
    // Additional profile fields can be added here if needed
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
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
    user: User;
    token: string;
}

export interface UserState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface NavigationProps {
    user: User;
    logout: () => void;
}
