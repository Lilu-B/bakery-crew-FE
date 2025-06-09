import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { createDonation } from '../api/donations';
import BottomNav from '../components/BottomNav';
import ProfileMenu from '../components/ProfileMenu';
import type { AxiosError } from 'axios';

const DonationCreate = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 🔒 Защита: только manager и developer могут видеть эту страницу
  if (!user || (user.role !== 'manager' && user.role !== 'developer')) {
    return <p>You do not have access to create donations.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔍 Проверка ввода
    if (!title.trim()) return setError('Title is required');
    if (!description.trim()) return setError('Description is required');
    if (description.length > 500) return setError('Description too long');

    try {
      await createDonation({
        title,
        description,
        deadline: deadline ? new Date(deadline).toISOString() : undefined
      });

      // 🧹 Очистка и переход
      setTitle('');
      setDescription('');
      setDeadline('');
      setError(null);

      navigate('/donations');
    } catch (err) {
      const error = err as AxiosError<{ msg?: string }>;
      setError(error.response?.data?.msg || 'Failed to create donation');
    }
  };

  return (
    <div className="create-donation-page">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>New Donation</h1>
        <ProfileMenu />
      </header>

      <form onSubmit={handleSubmit} className="card" style={{ marginTop: '1rem' }}>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
            style={{ width: '100%' }}
          ></textarea>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label>
            Deadline:{' '}
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </label>
        </div>

        {error && (
          <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button type="submit" className="btn-green">
            Submit
          </button>
          <button type="button" className="btn-red" onClick={() => navigate('/donations')}>
            Cancel
          </button>
        </div>
      </form>

      <BottomNav />
    </div>
  );
};

export default DonationCreate;