import api from './api.service';

export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);
export const changePassword = (data) => api.put('/users/change-password', data);
export const updateAvatar = (formData) => api.post('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getAllUsers = (params) => api.get('/users', { params });
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
