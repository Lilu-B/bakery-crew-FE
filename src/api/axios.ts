import axios from 'axios';

const api = axios.create({
  baseURL: '/api',    // это проксируется на http://localhost:3001/api из vite.config.ts
//   baseURL: import.meta.env.VITE_API_URL || '/api'   // Для продакшена позже можно будет сделать
});

// Добавляем интерсептор для обработки ошибок
// это специальный “перехватчик” каждого запроса, который автоматически добавляет токен из sessionStorage к заголовкам.
// Благодаря этому, тебе НЕ нужно вручную добавлять Authorization в handleLogin через api.defaults.headers.common[...].
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;