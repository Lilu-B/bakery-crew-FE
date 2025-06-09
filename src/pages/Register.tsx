import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { AxiosError } from 'axios';


const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    shift: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/register', form);
      setMessage({ type: 'success', text: 'Registered! Please wait for approval.' });
      setTimeout(() => navigate('/login'), 2000); 
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      if (error.response?.status === 409) {
        setMessage({ type: 'error', text: '❌ A user with this email already exists. Please try a different one.' });
      } else {
        const errorMsg = error.response?.data?.message || '❌ Registration failed. Please try again.';
        setMessage({ type: 'error', text: errorMsg });
      }
    }
  };

  return (
        <>
      {message && (
        <p aria-live={message.type === 'error' ? 'assertive' : 'polite'} style={{ color: message.type === 'error' ? 'darkred' : 'green' }}>
          {message.text}
        </p>
      )}
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <label>
        Name:
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Email:
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>
      <label>
        Password:
        <input name="password" type="password" value={form.password} onChange={handleChange} required />
      </label>
      <label>
        Phone:
        <input name="phone" value={form.phone} onChange={handleChange} />
      </label>
      <label>
        Shift:
        <select
          name="shift"
          value={form.shift}
          onChange={(e) => setForm({ ...form, shift: e.target.value })}
          required
        >
          <option value="">-- Select your shift --</option>
          <option value="1st">1st</option>
          <option value="2nd">2nd</option>
          <option value="night">Night</option>
        </select>
      </label>
      <button aria-label="Register" type="submit">Register</button>
    </form>
    </>
  );
};

export default Register;