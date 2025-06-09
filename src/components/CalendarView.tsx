import { useUser } from '../context/UserContext';
import { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import type { Event,CalendarViewProps } from '../types/event';
import AddToGoogleCalendar from '../components/AddToGoogleCalendar';

const CalendarView = ({ events }: CalendarViewProps) => {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  // ✅ Фильтрация по роли (мемоизировано)
  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      if (user?.role === 'user') {
        return event.applied === true;
      }
      if (user?.role === 'manager') {
        return event.shift === user.shift;
      }
      return true; // developer
    });
  }, [events, user]);

  // 🎯 Фильтрация по выбранной дате
  useEffect(() => {
    const matches = visibleEvents.filter(
      (event) =>
        format(new Date(event.date), 'yyyy-MM-dd') ===
        format(selectedDate, 'yyyy-MM-dd')
    );
    setFilteredEvents(matches);
  }, [selectedDate, visibleEvents]);

  // 📍 Отображение точки на календаре
  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasEvent = visibleEvents.some(
      (event) => format(new Date(event.date), 'yyyy-MM-dd') === dateStr
    );
    return hasEvent ? <div className="dot" aria-label="Has event" /> : null;
  };

  return (
    <div className="calendar-section">
      <h2 style={{ marginBottom: '1rem' }}>Your Event Calendar</h2>
      <Calendar
        aria-label="Event calendar" 
        aria-labelledby="calendar-heading"
        onChange={(value) => setSelectedDate(value as Date)}
        value={selectedDate}
        tileContent={tileContent}
        tileClassName={({ date, view }) => {
            if (view === 'month') {
            const day = date.getDay();
            if (day === 0 || day === 6) return 'weekend'; // воскресенье (0) или суббота (6)
            }
            return '';
        }}
      />

      {selectedDate && (
        <div className="selected-date-info" aria-live="polite" style={{ marginTop: '1rem' }}>
          <h3>Events on {format(selectedDate, 'd MMM yyyy')}</h3>
          {filteredEvents.length > 0 ? (
            <ul>
              {filteredEvents.map((event) => (
                <li key={event.id}>
                  {event.title} ({event.shift}){' '}
                  <AddToGoogleCalendar
                    title={event.title}
                    date={event.date}
                    description={event.description || ''}
                    />
                </li>
              ))}
            </ul>
          ) : (
            <p>No events on this day.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;