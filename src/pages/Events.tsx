import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { fetchEvents } from '../api/events';
import BottomNav from '../components/BottomNav';
import ProfileMenu from '../components/ProfileMenu';
import { format } from 'date-fns';
import type { AxiosError } from 'axios';
import type { Event } from '../types/event';



const Events = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      if (!user) return;

      try {
        const allEvents: Event[] = await fetchEvents();
        let filteredEvents: Event[] = [];

        if (user.role === 'developer') {
          filteredEvents = allEvents;
        } else if (user.role === 'manager') {
          filteredEvents = allEvents.filter(
            (event: Event) =>
              event.shift === user.shift
          );
        } else {
          filteredEvents = allEvents.filter(
            (event: Event) =>
              event.shift === user.shift || event.createdBy === user.managerId
          );
        }

        const sorted = filteredEvents.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setEvents(sorted);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        alert(error.response?.data?.message || '❌ Failed to load events');
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, [user]);

  if (loading || loadingEvents) return <p>Loading events...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="events-page" aria-labelledby="events-heading">
      <header className="fixed-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 id="events-heading">Bakery Crew Hub</h1>
        <ProfileMenu />
      </header>

      {events.length === 0 ? (
        <p aria-live="polite">No available events</p>
      ) : (
        events.map((event: Event) => {
          const cardClass =
            event.applied === false ? 'card active clickable' : 'card clickable';

          return (
            <div
              key={event.id}
              className={cardClass}
              onClick={() => navigate(`/events/${event.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/events/${event.id}`);
                }
              }}
              aria-label={`Event: ${event.title}, ${event.shift} shift, ${format(new Date(event.date), 'd MMM yyyy')}`}
            >
              <h3>{event.title}</h3>
              <p>{format(new Date(event.date), 'd MMM yyyy')} — {event.shift} Shift</p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>
                Created by: {event.creatorName}
              </p>
            </div>
          );
        })
      )}

      {user.role !== 'user' && (
        <button
          onClick={() => navigate('/events/create')}
          aria-label="Create an offer"
          style={{
            marginTop: '1rem',
            background: '#green',
            padding: '1rem',
            borderRadius: '8px',
            width: '100%',
          }}
        >
          Create an offer
        </button>
      )}

      <div className="fixed-footer">
        <BottomNav />
      </div>
    </div>
  );
};

export default Events;