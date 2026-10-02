import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    const resBody = response?.data;
    if (resBody && typeof resBody === 'object' && 'success' in resBody) {
      const payload = resBody.data !== undefined ? resBody.data : resBody;
      const pagination = resBody.pagination;

      if (Array.isArray(payload)) {
        payload.items = payload;
        payload.users = payload;
        payload.subjects = payload;
        payload.registrations = payload;
        payload.blogs = payload;
        payload.sliders = payload;
        payload.quizzes = payload;
        payload.lessons = payload;
        payload.questions = payload;
        payload.dimensions = payload;
        payload.packages = payload;
        payload.settings = payload;

        if (pagination) {
          payload.totalPages = pagination.totalPages;
          payload.totalItems = pagination.totalItems;
          payload.page = pagination.page;
          payload.currentPage = pagination.page;
          payload.pagination = pagination;
        }
        response.data = payload;
        response.items = payload;
        response.users = payload;
        response.subjects = payload;
        response.registrations = payload;
        response.blogs = payload;
        response.sliders = payload;
        response.quizzes = payload;
        response.lessons = payload;
        response.questions = payload;
        response.dimensions = payload;
        response.packages = payload;
        response.settings = payload;
        response.totalPages = pagination?.totalPages || 1;
        response.totalItems = pagination?.totalItems || payload.length;
      } else if (payload && typeof payload === 'object') {
        if (pagination) {
          payload.pagination = pagination;
          payload.totalPages = pagination.totalPages;
          payload.totalItems = pagination.totalItems;
        }
        response.data = payload;
      }
      response.message = resBody.message;
      response.success = resBody.success;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only clear and redirect if we're not on login/register/verify routes
      const pathname = window.location.pathname;
      if (!pathname.includes('/login') && !pathname.includes('/register') && !pathname.includes('/verify')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
