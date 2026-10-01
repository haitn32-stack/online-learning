import api from './api.service';

export const getDimensionsBySubject = (subjectId) => api.get(`/subjects/${subjectId}/dimensions`);
export const getDimensionById = (id) => api.get(`/dimensions/${id}`);
export const createDimension = (data) => api.post('/dimensions', data);
export const updateDimension = (id, data) => api.put(`/dimensions/${id}`, data);
