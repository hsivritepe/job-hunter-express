import axios from 'axios';
import { Action } from '@job-hunter/shared-types';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

// Create axios instance with auth header
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Action API functions
export const actionApi = {
    // Create a new action
    createAction: async (
        actionData: Omit<Action, '_id' | 'createdAt' | 'updatedAt'>
    ) => {
        const response = await api.post('/actions', actionData);
        return response.data;
    },

    // Get all actions for a specific job
    getActionsByJobId: async (jobId: string) => {
        const response = await api.get(`/actions/job/${jobId}`);
        return response.data;
    },

    // Get all actions for the current user
    getUserActions: async () => {
        const response = await api.get('/actions/user');
        return response.data;
    },

    // Update an action
    updateAction: async (
        actionId: string,
        actionData: Partial<Action>
    ) => {
        const response = await api.put(
            `/actions/${actionId}`,
            actionData
        );
        return response.data;
    },

    // Delete an action
    deleteAction: async (actionId: string) => {
        const response = await api.delete(`/actions/${actionId}`);
        return response.data;
    },
};
