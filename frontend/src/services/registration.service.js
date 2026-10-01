import api from './api.service';

export const createRegistration = (data) => api.post('/registrations', data);
export const getMyRegistrations = (params) => api.get('/registrations/my', { params });
export const cancelRegistration = (id) => api.patch(`/registrations/${id}/cancel`);
export const updateMyRegistration = (id, data) => api.put(`/registrations/my/${id}`, data);
export const getAllRegistrations = (params) => api.get('/registrations', { params });
export const getRegistrationById = (id) => api.get(`/registrations/${id}`);
export const updateRegistrationStatus = (id, data) => api.patch(`/registrations/${id}/status`, data);
export const createRegistrationByStaff = (data) => api.post('/registrations/staff', data);
