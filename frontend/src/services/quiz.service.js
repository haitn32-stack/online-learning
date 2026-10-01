import api from './api.service';

export const getAllQuizzes = (params) => api.get('/quizzes', { params });
export const getQuizById = (id) => api.get(`/quizzes/${id}`);
export const createQuiz = (data) => api.post('/quizzes', data);
export const updateQuiz = (id, data) => api.put(`/quizzes/${id}`, data);
export const submitQuiz = (data) => api.post('/quizzes/submit', data);
export const getMyQuizResults = (params) => api.get('/quizzes/my-results', { params });
export const getQuizResultById = (resultId) => api.get(`/quizzes/results/${resultId}`);
