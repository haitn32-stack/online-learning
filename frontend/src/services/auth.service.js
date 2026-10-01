import api from './api.service';

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (data) => api.post('/auth/register', data);
export const verifyCode = (email, code) => api.post('/auth/verify-code', { email, code });
export const resendCode = (email) => api.post('/auth/resend-code', { email });
export const verifyEmail = (token) => api.get(`/auth/verify-email/${token}`);
export const requestPasswordReset = (email) => api.post('/auth/reset-password-request', { email });
export const resetPassword = (token, newPassword) => api.post('/auth/reset-password', { token, newPassword });
