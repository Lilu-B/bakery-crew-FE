import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';

const api = axios.create({
  baseURL: '/api',    // это проксируется на http://localhost:3001/api из vite.config.ts
//   baseURL: import.meta.env.VITE_API_URL || '/api'   // Для продакшена позже можно будет сделать
});

// 🔐 Добавляем токен - интерсептор для обработки ошибок
// это специальный “перехватчик” каждого запроса, который автоматически добавляет токен из sessionStorage к заголовкам.
// Благодаря этому, тебе НЕ нужно вручную добавлять Authorization в handleLogin через api.defaults.headers.common[...].
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✨ Добавляем перехватчик ответов — camelCase конвертация
api.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === 'object' &&
      !Array.isArray(response.data)
    ) {
      return {
        ...response,
        data: camelcaseKeys(response.data, { deep: true }),
      };
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;