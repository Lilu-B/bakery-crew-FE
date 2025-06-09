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
        if (error.response?.status === 409) {
          alert('❌ A user with this email already exists. Please try a different one.');
        } else {
          const errorMsg = error.response?.data?.message || '❌ Registration failed. Please try again.';
          alert(errorMsg);
        }
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
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;