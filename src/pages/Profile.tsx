import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, setUser, logout } = useUser();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    shift: user?.shift || ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.patch('/users/me', form);
      setUser(res.data); 
      setMessage({ type: 'success', text: 'Profile updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    try {
      await api.delete(`/users/${user?.id}`);
      logout();
      navigate('/login');
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete account' });
      console.error(err);
    }
  };

  {message && (
    <p
      aria-live={message.type === 'error' ? 'assertive' : 'polite'}
      style={{
        color: message.type === 'error' ? 'darkred' : 'green',
        marginBottom: '1rem'
      }}
    >
      {message.text}
    </p>
  )}

  return (
  <div className="main-content">
    <section className="card">
      <h2>Profile Settings</h2>

      <form onSubmit={handleSubmit} className="card" style={{ marginTop: '1rem' }}>
        <label htmlFor="profile-name">
          <h3>Name:</h3>
          <input
            id="profile-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        {user?.role !== 'developer' && (
          <>
            <label htmlFor="profile-phone">
              <h3>Phone:</h3>
              <input
                id="profile-phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="profile-shift">
              <h3>Shift:</h3>
              <input
                id="profile-shift"
                name="shift"
                value={form.shift}
                disabled
                readOnly
              />
            </label>
          </>
        )}

        <button type="submit" aria-label="Save Profile" className="button-green">
          Save
        </button>
      </form>

      {user?.managerId && (
        <p style={{ marginTop: '1rem' }}>
          Assigned Manager ID: <strong>{user.managerId}</strong>
        </p>
      )}

      <hr style={{ margin: '1rem 0' }} />

      <button
        onClick={handleDelete}
        aria-label="Delete Account"
        className="button-red"
      >
        Delete Account
      </button>
    </section>
  </div>
);
};

export default Profile;