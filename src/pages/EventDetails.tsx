import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { format } from 'date-fns';

import api from '../api/axios'; 
import { useUser } from '../context/UserContext';
import ProfileMenu from '../components/ProfileMenu';
import BottomNav from '../components/BottomNav';

interface Event {
  id: number;
  title: string;
  date: string;
  shift: '1st' | '2nd' | 'night';
  managerId: number;
  description?: string;
  applicants: string[];
}

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const data = res.data as Event;
        setEvent(data);

        if (data.applicants.includes(user?.name || '')) {
          setApplied(true);
        }
      } catch (err) {
        const axiosError = err as AxiosError<{ msg?: string }>;
        setError(axiosError.response?.data?.msg || 'Failed to load event.');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, user]);

  const handleApply = async () => {
    try {
      await api.post(`/events/${id}/apply`);
      setApplied(true);
    } catch (err) {
      const axiosError = err as AxiosError<{ msg?: string }>;
      alert(axiosError.response?.data?.msg || 'Could not apply to this event.');
    }
  };

  const handleNotNow = () => {
    navigate('/events');
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this event?');
    if (!confirm) return;
    try {
      await api.delete(`/events/${id}`);
      navigate('/events');
    } catch (err) {
      const axiosError = err as AxiosError<{ msg?: string }>;
      alert(axiosError.response?.data?.msg || 'Failed to delete event.');
    }
  };

  const isUser = user?.role === 'user';
  const isManager = user?.role === 'manager' && user.id === event?.managerId;
  const isAdmin = user?.role === 'developer';

  const canApply = isUser && event?.shift === user.shift;

  if (loading) return <p>Loading event details...</p>;
  if (error || !event) return <p style={{ color: 'red' }}>{error || 'Event not found'}</p>;

  return (
    <div className="home-container">
      <header className="home-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Bakery Crew</h1>
        <ProfileMenu />
      </header>

      <div style={{ padding: '1rem' }}>
        <h2>{event.title}</h2>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>{format(new Date(event.date), 'd MMM yyyy')}</strong> — Shift: {event.shift}
        </p>

        {event.description && <p>{event.description}</p>}

        {/* 🔘 Кнопки только для сотрудника со своей сменой */}
        {canApply && (
          <>
            {!applied ? (
              <>
                <button onClick={handleApply} style={{ marginRight: '10px' }}>Apply</button>
                <button onClick={handleNotNow}>Not now</button>
              </>
            ) : (
              <p style={{ color: 'green' }}>✅ You have successfully applied</p>
            )}
          </>
        )}

        {/* 🔘 Удаление для менеджера или админа */}
        {(isManager || isAdmin) && (
          <button
            onClick={handleDelete}
            style={{ background: 'red', color: 'white', marginTop: '1rem' }}
          >
            Delete Event
          </button>
        )}

        <h4 style={{ marginTop: '1rem' }}>Who applied:</h4>
        <ul>
          {event.applicants.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
      </div>

      <BottomNav />
    </div>
  );
};

export default EventDetails;