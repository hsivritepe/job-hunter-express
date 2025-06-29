// User related types

export interface User {
    _id: string;
    name: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserProfile extends User {
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

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
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
