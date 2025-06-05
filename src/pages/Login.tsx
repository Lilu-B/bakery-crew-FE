import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { AxiosError } from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { useUser } from '../context/UserContext';
import type { User } from '../context/UserContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [loginInProgress, setLoginInProgress] = useState(false); // ⏳ статус входа

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginInProgress) {
      console.warn('🔄 Login already in progress, please wait...');
      return; // предотвращаем повторный вход, если уже в процессе
    }
    setLoginInProgress(true); // устанавливаем статус входа в процессе

    // Проверяем, есть ли уже пользователь в контексте
    // Добавляем обработку ошибок с AxiosError
    try {
console.log('🔐 Login handler triggered');
      const res = await api.post('/login', { email, password });
console.log('✅ Login success, token:', res.data.token);

      sessionStorage.setItem('token', res.data.token); // токен сохранится в sessionStorage
      const profile = await api.get('/protected');   // interceptor добавит токен автоматически из sessionStorage в api/axios.ts
      const normalizedUser = camelcaseKeys(profile.data, { deep: true });
      setUser(normalizedUser as User);  // сохраняем в глобальный контекст
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error('Login error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoginInProgress(false);
    }
  };

  // 👉 переход на главную после успешного входа
  useEffect(() => {
    if (user && user.isApproved && loginInProgress === false) {
      console.log('🎉 User profile:', user);
      navigate('/');
    }
  }, [user, loginInProgress, navigate]);

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={loginInProgress}>
        {loginInProgress ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default Login;