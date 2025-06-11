import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { Event } from '../types/event';

interface Props {
  events: Event[];
}

function EventCardList({ events }: Props) {
  const navigate = useNavigate();

  return (
    <>
      {events.map((event) => {
        const cardClass =
          event.applied === false ? 'card active clickable' : 'card clickable';

        return (
          <div
            key={event.id}
            className={cardClass}
            role="button"
            tabIndex={0}
            aria-label={`Event: ${event.title}, ${event.shift} shift, ${format(new Date(event.date), 'd MMM yyyy')}`}
            onClick={() => navigate(`/events/${event.id}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/events/${event.id}`);
              }
            }}
          >
            <h3>{event.title}</h3>
            <p>{format(new Date(event.date), 'd MMM yyyy')} — Shift: {event.shift}</p>
            {event.creatorName && (
              <p style={{ fontSize: '0.85rem', color: '#666' }}>
                Created by: {event.creatorName}
              </p>
            )}
          </div>
        );
      })}
    </>
  );
}

export default EventCardList;