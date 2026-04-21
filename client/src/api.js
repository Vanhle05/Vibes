import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vibes_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('vibes_token');
      localStorage.removeItem('vibes_user');
      
      // Chỉ redirect nếu không ở trang login/register để tránh loop
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register' && path !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
