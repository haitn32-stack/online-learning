import api from './api.service';

export const getAllSettings = (params) => api.get('/settings', { params });
export const getSettingById = (id) => api.get(`/settings/${id}`);
export const createSetting = (data) => api.post('/settings', data);
export const updateSetting = (id, data) => api.put(`/settings/${id}`, data);
export const toggleSettingStatus = (id) => api.patch(`/settings/${id}/status`);
