import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEventById, applyToEvent, deleteEvent } from '../api/events';
import { useUser } from '../context/UserContext';
import AddToGoogleCalendar from '../components/AddToGoogleCalendar';
import { format } from 'date-fns';
import type { Event } from '../types/event';
import type { Applicant } from '../types/user';
import type { AxiosError } from 'axios';
import api from '../api/axios';


const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const id = Number(eventId);
  const isInvalid = !eventId || isNaN(id); 

  useEffect(() => {
      if (isInvalid) {
            setError('Event not found');
            navigate('/events');
            return; 
        }

    const loadEvent = async () => {
      try {
        const res = await fetchEventById(id);
        setEvent(res);
        if (res.applied) setSubmitted(true);

        const applicantsRes = await api.get(`/events/${eventId}/applicants`);
        setApplicants(applicantsRes.data.applicants || []);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        alert(error.response?.data?.message || 'Error loading event');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [isInvalid, navigate]);

  if (isInvalid || error) return null;


    const handleApply = async () => {
    try {
        const { msg } = await applyToEvent(id); 
        alert(msg); 
 
        setSubmitted(true);
 
        const res = await api.get(`/events/${id}/applicants`);
        setApplicants(res.data.applicants || []);
    } catch (err) {
        const error = err as AxiosError<{ msg?: string }>;
        alert(error.response?.data?.msg || 'Failed to apply');
    }
    };

  const handleNotNow = () => navigate('/events');

    const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
        const { msg } = await deleteEvent(id); 
        alert(msg); 
        navigate('/events'); 
    } catch (err) {
        const error = err as AxiosError<{ msg?: string }>;
        alert(error.response?.data?.msg || 'Failed to delete');
    }
    };

  if (loading || !event) return <p>Loading...</p>;

  return (
    <div className="main-content" role="main" aria-labelledby="event-details-heading">

        {error && (
        <div
            role="alert"
            aria-live="assertive"
            style={{ color: 'red', marginTop: '1rem' }}
        >
            {error}
        </div>
        )}

    <section className="card">
      <h2>{event.title}</h2>
      <p>
        <strong>{format(new Date(event.date), 'EEEE')}</strong> — {event.shift} Shift
      </p>

      {user?.role === 'user' && !submitted && (
        <div className="button-group">
          <button
            onClick={handleApply}
            aria-label="Apply for event"
            className="button-green"
          >
            Apply
          </button>
          <button
            onClick={handleNotNow}
            aria-label="Not Now"
            className="button-red"
          >
            Not Now
          </button>
        </div>
      )}

      {submitted && (
        <>
          <p aria-live="polite" style={{ color: 'green', marginTop: '1rem' }}>
            Your Shift Request Was Submitted!
          </p>
          <AddToGoogleCalendar
            title={event.title}
            date={event.date}
            description={event.description || ''}
          />
        </>
          )}

      {user?.role !== 'user' && (
        <div style={{ textAlign: 'right' }}>
          <button onClick={handleDelete} aria-label="Delete event" className="button-red">
            DELETE
          </button>
        </div>
      )}
      </section>

      <section className="card" style={{ marginTop: '2rem' }}> 
        <p><strong>Hi everyone,</strong></p>
        <p>{event.description || 'No description provided.'}</p>
      </section>

      <section aria-labelledby="applicants-heading" style={{ marginTop: '2rem' }}>
        <p id="applicants-heading"><strong>Who applied</strong></p>
        <ul>
          {applicants.length === 0 ? (
            <li>No applicants yet.</li>
          ) : (
            applicants.map((a) => <li key={a.id}>{a.name}</li>)
          )}
        </ul>
      </section>
    </div>
  );
};

export default EventDetails;