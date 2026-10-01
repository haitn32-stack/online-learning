import api from './api.service';

export const getPublishedSubjects = (params) => api.get('/subjects/public', { params });
export const getPublishedSubjectById = (id) => api.get(`/subjects/public/${id}`);
export const getAllSubjects = (params) => api.get('/subjects', { params });
export const getSubjectById = (id) => api.get(`/subjects/${id}`);
export const createSubject = (data) => api.post('/subjects', data);
export const updateSubject = (id, data) => api.put(`/subjects/${id}`, data);
export const togglePublish = (id, published) => api.patch(`/subjects/${id}/publish`, { published });
