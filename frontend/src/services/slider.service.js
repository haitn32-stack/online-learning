import api from './api.service';

export const getActiveSliders = () => api.get('/sliders/active');
export const getAllSliders = (params) => api.get('/sliders', { params });
export const getSliderById = (id) => api.get(`/sliders/${id}`);
export const createSlider = (data) => api.post('/sliders', data);
export const updateSlider = (id, data) => api.put(`/sliders/${id}`, data);
