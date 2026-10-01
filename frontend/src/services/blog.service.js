import api from './api.service';

export const getPublicBlogs = (params) => api.get('/blogs/public', { params });
export const getPublicBlogById = (id) => api.get(`/blogs/public/${id}`);
export const getAllBlogs = (params) => api.get('/blogs', { params });
export const createBlog = (data) => api.post('/blogs', data);
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data);
export const toggleFeatured = (id) => api.patch(`/blogs/${id}/featured`);
