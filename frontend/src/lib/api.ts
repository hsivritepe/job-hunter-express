import axios from 'axios';

const api = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor for authentication
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    login: async (email: string, password: string) => {
        const response = await api.post('/users/login', {
            email,
            password,
        });
        return response.data;
    },
    register: async (
        name: string,
        email: string,
        password: string
    ) => {
        const response = await api.post('/users/register', {
            name,
            email,
            password,
        });
        return response.data;
    },
};

export const jobs = {
    getAll: async () => {
        const response = await api.get('/jobs');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    },
    create: async (jobData: any) => {
        const response = await api.post('/jobs', jobData);
        return response.data;
    },
};

export default api;
