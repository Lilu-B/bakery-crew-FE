import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { fetchEvents } from '../api/events';
import { fetchAllDonations } from '../api/donations';
import BottomNav from '../components/BottomNav';   
import ProfileMenu from '../components/ProfileMenu';
import CalendarView from '../components/CalendarView';
import PendingUserCards from '../components/PendingUserCards';
import { format } from 'date-fns';
import type { AxiosError } from 'axios'; 
import type { Event } from '../types/event';
import type { Donation } from '../types/donation';


const Home = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
        const eventsData = await fetchEvents();
        if (user?.role === 'manager' || user?.role === 'user') {
          const filteredEvents = eventsData.filter((event) => event.shift === user.shift);
          setEvents(filteredEvents);
        } else {
          setEvents(eventsData);
        }

        const donationsData = await fetchAllDonations();
        setDonations(donationsData);
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            const errorMsg = error.response?.data?.message || 'Failed to load dashboard data.';
            alert(errorMsg);
            setEvents([]);
            setDonations([]);
        }
    };
    fetchData();
    }, [user]);

  return (
    <div className="home-container" aria-labelledby="home-heading">

      <header className="fixed-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 id="home-heading">Bakery Crew Hub</h1>
        <ProfileMenu />
      </header>

      <section className="home-shift card">
        <p>Shift: <strong>{user?.shift || 'Not set'}</strong></p>
        <p>Role: <strong>{user?.role}</strong></p>
      </section>
      
      {user?.role !== 'user' && (
        <section>
          <PendingUserCards />
        </section>
      )}

      <section>
        <h3>Upcoming Events</h3>
        {!Array.isArray(events) || events.length === 0 ? (
          <p  aria-live="polite">No events</p>
        ) : (
          events.map((event) => {
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
              </div>
            );
          })
        )}
      </section>

      <section>
        <h3>Community Support</h3>
      
        {!Array.isArray(donations) || donations.length === 0 ? (
          <p aria-live="polite">No active donations</p>
        ) : (
          donations.map((donation) => {
            const cardClass =
              user?.role === 'user' && donation.hasDonated === true
                ? 'card clickable'          
                : 'card active clickable';   

            return (
              <div
                key={donation.id}
                className={cardClass}
                role="button"
                tabIndex={0}
                aria-label={`Donation: ${donation.title}, deadline ${format(new Date(donation.deadline), 'd MMM yyyy')}`}
                onClick={() => navigate(`/donations/${donation.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/donations/${donation.id}`);
                  }
                }}
              >
                <h3>{donation.title}</h3>
                <p>Deadline: {format(new Date(donation.deadline), 'd MMM yyyy')}</p>
              </div>
            );
          })
        )}
      </section>

      <section className="card calendar-placeholder" style={{ textAlign: 'center', background: '#eee' }}>
        <h3>Upcoming Events</h3>
        <CalendarView events={events} />
      </section>

      <div className="fixed-footer">
        <BottomNav />
      </div>
    </div>
  );
};

export default Home;
