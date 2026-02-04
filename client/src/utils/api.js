import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (data) => api.post('/api/auth/register', data),
    login: (data) => api.post('/api/auth/login', data),
};

export const userAPI = {
    getProfile: () => api.get('/api/profile'),
    getAnnouncements: () => api.get('/api/announcements'),
};

export const hrAPI = {
    getDashboard: () => api.get('/api/hr/dashboard'),
    getAllEmployees: () => api.get('/api/hr/employees'),
    postAnnouncement: (data) => api.post('/api/hr/announcements', data),
    getAnnouncements: () => api.get('/api/announcements'),
};

export const adminAPI = {
    getDashboard: () => api.get('/api/admin/dashboard'),
    getAllUsers: () => api.get('/api/admin/users'),
    getUserById: (id) => api.get(`/api/admin/users/${id}`),
    updateUser: (id, data) => api.put(`/api/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
    activateUser: (id) => api.patch(`/api/admin/users/${id}/activate`),
    getAuditLogs: (action) => api.get('/api/admin/audit-logs', { params: { action } }),
    getSystemStats: () => api.get('/api/admin/stats'),
};

export default api;

