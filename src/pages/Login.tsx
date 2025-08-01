import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import type { AxiosError } from 'axios';
import { useUser } from '../context/UserContext';
import type { User } from '../context/UserContext';
import RedirectNotice from '../components/RedirectNotice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [loginInProgress, setLoginInProgress] = useState(false); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginInProgress) {
      console.warn('Login already in progress, please wait...');
      return; 
    }
    setLoginInProgress(true); 

    try {
      console.log('🔐 Login handler triggered');
      const res = await api.post('/login', { email, password });
      console.log('✅ Login success, token:', res.data.token);

      sessionStorage.setItem('token', res.data.token); 
      const profile = await api.get('/protected');   
      const normalizedUser = profile.data;
      setUser(normalizedUser as User);  
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoginInProgress(false);
    }
  };

  useEffect(() => {
    if (user && user.isApproved && loginInProgress === false) {
      console.log('🎉 User profile:', user);
      navigate('/');
    }
  }, [user, loginInProgress, navigate]);

  return <RedirectNotice />;
}

export default Login;