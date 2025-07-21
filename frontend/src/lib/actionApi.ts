import api from './api';
import { Action, ActionTemplate } from '@job-hunter/shared-types';

// Action Template API functions
export const actionTemplateApi = {
    // Get all action templates
    getActionTemplates: async () => {
        const response = await api.get('/actions/templates');
        return response.data;
    },

    // Create a new action template (admin only)
    createActionTemplate: async (
        templateData: Omit<
            ActionTemplate,
            '_id' | 'createdAt' | 'updatedAt'
        >
    ) => {
        const response = await api.post(
            '/actions/templates',
            templateData
        );
        return response.data;
    },

    // Update an action template (admin only)
    updateActionTemplate: async (
        templateId: string,
        templateData: Partial<ActionTemplate>
    ) => {
        const response = await api.put(
            `/actions/templates/${templateId}`,
            templateData
        );
        return response.data;
    },

    // Delete an action template (admin only)
    deleteActionTemplate: async (templateId: string) => {
        const response = await api.delete(
            `/actions/templates/${templateId}`
        );
        return response.data;
    },
};

// Action API functions
export const actionApi = {
    // Create a new action
    createAction: async (actionData: {
        jobId: string;
        userId: string;
        templateId: string;
        date: Date;
        notes?: string;
        scheduledDate?: Date;
    }) => {
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

    // Get action templates (alias for convenience)
    getActionTemplates: async () => {
        const response = await api.get('/actions/templates');
        return response.data;
    },
};
