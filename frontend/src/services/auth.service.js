import api from './api.service';

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (data) => api.post('/auth/register', data);
export const verifyEmail = (token) => api.get(`/auth/verify/${token}`);
export const requestPasswordReset = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, newPassword) => api.post(`/auth/reset-password/${token}`, { password: newPassword });
