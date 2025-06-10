import { format } from 'date-fns';

interface AddToGoogleCalendarProps {
  title: string;
  date: string;
  description?: string;
}

const AddToGoogleCalendar = ({ title, date, description }: AddToGoogleCalendarProps) => {
  const handleClick = () => {
    const formatted = format(new Date(date), 'yyyyMMdd');
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.set('action', 'TEMPLATE');
    url.searchParams.set('text', title);
    url.searchParams.set('dates', `${formatted}/${formatted}`);
    url.searchParams.set('details', description || 'Bakery Crew Event');
    window.open(url.toString(), '_blank');
  };

  return (
    <div style={{ marginTop: '1rem' }}
    role="group"
    aria-label={`Google Calendar export for ${title}`}
    >
      <button
        aria-label={`Add "${title}" to Google Calendar`}
        style={{
          backgroundColor: '#green',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        onClick={handleClick}
      >
        Add to Google Calendar
      </button>
    </div>
  );
};

export default AddToGoogleCalendar;