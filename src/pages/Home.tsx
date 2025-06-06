import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { fetchEvents } from '../api/events';
import { fetchActiveDonations } from '../api/donations';
import BottomNav from '../components/BottomNav';   
import ProfileMenu from '../components/ProfileMenu';
import type { AxiosError } from 'axios'; 
import type { Event } from '../types/event';
import type { Donation } from '../types/donation';
import { format } from 'date-fns';


const Home = () => {
  const { user } = useUser();

  const [events, setEvents] = useState<Event[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        try {
        const eventsData = await fetchEvents();
        const donationsData = await fetchActiveDonations();
        setEvents(eventsData);
        setDonations(donationsData);
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            const errorMsg = error.response?.data?.message || '❌ Failed to load dashboard data.';
            console.error('❌ Dashboard error:', errorMsg);
            alert(errorMsg);
            // Очистка данных при ошибке
            setEvents([]);
            setDonations([]);
        }
    };
    fetchData();
    }, []);

console.log('EVENTS:', events); 

  return (
    // <div>
    //   <h2>Welcome, {user?.name}</h2>
    //   <p>Your role: {user?.role}</p>
    //   <p>Your shift: {user?.shift}</p>
    //   <button onClick={logout}>Logout</button>
    // </div>

    <div className="home-container">
      {/* 🔝 Шапка */}
    <header className="home-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1>Bakery Crew</h1>
      <ProfileMenu />
    </header>

      {/* 👤 Смена пользователя */}
      <section className="home-shift card">
        <p>Shift: <strong>{user?.shift || 'Not set'}</strong></p>
        <p>Role: <strong>{user?.role}</strong></p>
      </section>

      {/* 🔔 Динамические события */}
      <section>
        {!Array.isArray(events) || events.length === 0 ? (
          <p>No events</p>
        ) : (
          events.map((event) => (
            <div 
              key={event.id} 
              className="card active clickable"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <h3>{event.title}</h3>
              <p>{format(new Date(event.date), 'd MMM yyyy')} — Shift: {event.shift}</p>
            </div>
          ))
        )}
      </section>

      {/* 💰 Динамические донаты */}
      <section>
        {!Array.isArray(donations) || donations.length === 0 ? (
          <p>No active donations</p>
        ) : (
          donations.map((donation) => (
            <div 
              key={donation.id} 
              className="card active clickable"
              onClick={() => navigate(`/donations/${donation.id}`)}
            >
              <h3>{donation.title}</h3>
              <p>Deadline: {format(new Date(donation.deadline), 'd MMM yyyy')}</p>
            </div>
          ))
        )}
      </section>

      {/* 🗓 Календарь-заглушка */}
      <section className="card calendar-placeholder" style={{ textAlign: 'center', background: '#eee' }}>
        <h3>Upcoming Events</h3>
        <p>[Google Calendar here]</p>
      </section>

      <BottomNav />
    </div>
  );
};

export default Home;