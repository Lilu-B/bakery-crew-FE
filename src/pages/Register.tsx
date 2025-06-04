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

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/register', form);
      alert('Registered! Please wait for approval.');
      navigate('/login');
    } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        const errorMsg = error.response?.data?.message || '❌ Registration failed. Please try again.';
        console.error('❌ Registration error:', errorMsg);
        alert(errorMsg);
        }
  };

  return (
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
        <input name="shift" value={form.shift} onChange={handleChange} />
      </label>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;