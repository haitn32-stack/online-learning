import api from './api.service';

export const getAllQuestions = (params) => api.get('/questions', { params });
export const getQuestionById = (id) => api.get(`/questions/${id}`);
export const createQuestion = (data) => api.post('/questions', data);
export const updateQuestion = (id, data) => api.put(`/questions/${id}`, data);
export const toggleQuestionStatus = (id) => api.patch(`/questions/${id}/status`);
export const importQuestions = (data) => api.post('/questions/import', data);
