import api from './api.service';

export const getDashboardStats = () => api.get('/dashboard/stats');
