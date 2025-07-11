import { Job } from '@/types';
import api from './api';

export const jobApi = {
    // Get all jobs for the authenticated user
    getJobs: async (): Promise<Job[]> => {
        const response = await api.get('/jobs');
        return response.data.jobs;
    },

    // Get a specific job by ID
    getJobById: async (jobId: string): Promise<Job> => {
        const response = await api.get(`/jobs/${jobId}`);
        return response.data.job;
    },

    // Create a new job
    createJob: async (
        jobData: Omit<
            Job,
            '_id' | 'userId' | 'createdAt' | 'updatedAt'
        >
    ): Promise<Job> => {
        const response = await api.post('/jobs/create', jobData);
        return response.data.job;
    },

    // Update a job
    updateJob: async (
        jobId: string,
        jobData: Partial<Job>
    ): Promise<Job> => {
        const response = await api.put(`/jobs/${jobId}`, jobData);
        return response.data.job;
    },

    // Delete a job
    deleteJob: async (jobId: string): Promise<void> => {
        await api.delete(`/jobs/${jobId}`);
    },
};
