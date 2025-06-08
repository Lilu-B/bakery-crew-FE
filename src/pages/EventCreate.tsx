import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { createEvent } from '../api/events';
import BottomNav from '../components/BottomNav';
import ProfileMenu from '../components/ProfileMenu';
import type { AxiosError } from 'axios';

const EventCreate = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [shift, setShift] = useState(user?.shift || '1st');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!user || (user.role !== 'manager' && user.role !== 'developer')) {
    return <p>You do not have access to create events.</p>;
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // 💥 Сначала проверяем все поля
  if (!title.trim()) {
    return setError('Title is required');
  }
  if (!date) {
    return setError('Date is required');
  }
  if (!shift) {
    return setError('Shift is required');
  }
  if (description && description.length > 500) {
    return setError('Description cannot exceed 500 characters');
  }

  // ✅ Если всё ОК — форматируем дату и отправляем
  const formattedDate = new Date(date).toISOString();

  try {
    await createEvent({
      title,
      description,
      date: formattedDate,
      shift,
    });

    // 🧹 Очищаем форму
    setError(null);
    setTitle('');
    setDate('');
    setShift(user.shift || '1st');
    setDescription('');

    navigate('/events');
  } catch (err) {
    const error = err as AxiosError<{ msg?: string }>;
    setError(error.response?.data?.msg || 'Failed to create event');
  }
};

  return (
    <div className="create-event-page">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Bakery Crew Hub</h1>
        <ProfileMenu />
      </header>

      <form onSubmit={handleSubmit} className="card" style={{ marginTop: '1rem' }}>
        <div style={{ marginTop: '1rem' }}>
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
        <label>
            Date:{' '}
            <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            />
        </label>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label>
            Shift:{' '}
            <select
                value={shift}
                onChange={(e) => setShift(e.target.value as '1st' | '2nd' | 'night')}
                disabled={user.role === 'manager'} // Менеджер не может менять
            >
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="night">night</option>
            </select>
          </label>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            style={{ width: '100%' }}
          ></textarea>
        </div>

        {error && (
          <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button type="submit" className="btn-green">
            Submit
          </button>
          <button
            type="button"
            className="btn-red"
            onClick={() => navigate('/events')}
          >
            Cancel
          </button>
        </div>
      </form>

      <BottomNav />
    </div>
  );
};

export default EventCreate;
