import api from './api.service';

export const getLessonsBySubject = (subjectId) => api.get(`/subjects/${subjectId}/lessons`);
export const getLessonById = (id) => api.get(`/lessons/${id}`);
export const createLesson = (data) => api.post('/lessons', data);
export const updateLesson = (id, data) => api.put(`/lessons/${id}`, data);
export const toggleLessonStatus = (id) => api.patch(`/lessons/${id}/status`);
