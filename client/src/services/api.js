import axios from 'axios';

export const TOKEN_KEY = 'ncb_token';

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL
// });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const hadToken = Boolean(localStorage.getItem(TOKEN_KEY));
    if (error.response?.status === 401 && hadToken) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') =>
  error?.response?.data?.message ||
  (error?.request && !error?.response ? 'Cannot reach the server. Check your connection.' : fallback);

export default api;
