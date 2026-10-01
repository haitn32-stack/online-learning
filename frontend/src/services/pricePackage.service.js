import api from './api.service';

export const getPackagesBySubject = (subjectId) => api.get(`/subjects/${subjectId}/price-packages`);
export const getPackageById = (id) => api.get(`/price-packages/${id}`);
export const createPackage = (data) => api.post('/price-packages', data);
export const updatePackage = (id, data) => api.put(`/price-packages/${id}`, data);
