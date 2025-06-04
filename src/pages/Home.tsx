import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { fetchEvents } from '../api/events';
import { fetchActiveDonations } from '../api/donations';
import BottomNav from '../components/BottomNav';   
import type { AxiosError } from 'axios'; 

interface Event {
  id: number;
  title: string;
  date: string;
  shift: string;
}

interface Donation {
  id: number;
  title: string;
  deadline: string;
}

const Home = () => {
  const { user, logout } = useUser();

  const [events, setEvents] = useState<Event[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

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
        <div title="Edit profile" style={{ fontSize: '1.8rem', cursor: 'pointer' }}>😊</div>
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
            <div key={event.id} className="card active">
              <h3>{event.title}</h3>
              <p>{event.date} — Shift: {event.shift}</p>
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
            <div key={donation.id} className="card active">
              <h3>{donation.title}</h3>
              <p>Deadline: {donation.deadline}</p>
            </div>
          ))
        )}
      </section>

      {/* 🗓 Календарь-заглушка */}
      <section className="card calendar-placeholder" style={{ textAlign: 'center', background: '#eee' }}>
        <h3>Upcoming Events</h3>
        <p>[Google Calendar here]</p>
      </section>

      {/* 🔽 Нижнее меню (временно) */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '2rem',
        borderTop: '1px solid var(--color-gray)',
        paddingTop: '1rem'
      }}>
        <button>🏠</button>
        <button>📅</button>
        <button>🐷</button>
        <button>💬</button>
      </nav>

      <button onClick={logout} style={{ marginTop: '1rem', width: '100%' }}>Logout</button>
      <BottomNav />
    </div>
  );
};

export default Home;