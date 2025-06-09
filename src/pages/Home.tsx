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
        // Получаем активные донаты
        // Если пользователь — менеджер, то фильтруем события по смене
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
            const errorMsg = error.response?.data?.message || '❌ Failed to load dashboard data.';
            console.error('❌ Dashboard error:', errorMsg);
            alert(errorMsg);
            // Очистка данных при ошибке
            setEvents([]);
            setDonations([]);
        }
    };
    fetchData();
    }, [user]);

  return (
    // <div>
    //   <h2>Welcome, {user?.name}</h2>
    //   <p>Your role: {user?.role}</p>
    //   <p>Your shift: {user?.shift}</p>
    //   <button onClick={logout}>Logout</button>
    // </div>

    <div className="home-container">
      {/* 🔝 Шапка */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Bakery Crew Hub</h1>
        <ProfileMenu />
      </header>

      {/* 👤 Смена пользователя */}
      <section className="home-shift card">
        <p>Shift: <strong>{user?.shift || 'Not set'}</strong></p>
        <p>Role: <strong>{user?.role}</strong></p>
      </section>
      
      {/* 👥 Карточки - неподтвержденные пользователи */}
      {user?.role !== 'user' && (
        <section>
          <h3>Pending Users</h3>
          <PendingUserCards />
        </section>
      )}

      {/* 🔔 Динамические события */}
      <section>
        <h3>Upcoming Events</h3>
        {!Array.isArray(events) || events.length === 0 ? (
          <p>No events</p>
        ) : (
          events.map((event) => {
            const cardClass =
              event.applied === false ? 'card active clickable' : 'card clickable';

            return (
              <div 
                key={event.id} 
                className={cardClass}
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <h3>{event.title}</h3>
                <p>{format(new Date(event.date), 'd MMM yyyy')} — Shift: {event.shift}</p>
              </div>
            );
          })
        )}
      </section>

      {/* 💰 Динамические донаты */}
      <section>
        <h3>Community Support</h3>
      
        {!Array.isArray(donations) || donations.length === 0 ? (
          <p>No active donations</p>
        ) : (
          donations.map((donation) => {
            const cardClass =
              user?.role === 'user' && donation.hasDonated === true
                ? 'card clickable'             // Серый — уже пожертвовал
                : 'card active clickable';     // Красный — ещё не пожертвовал

            return (
              <div
                key={donation.id}
                className={cardClass}
                onClick={() => navigate(`/donations/${donation.id}`)}
              >
                <h3>{donation.title}</h3>
                <p>Deadline: {format(new Date(donation.deadline), 'd MMM yyyy')}</p>
              </div>
            );
          })
        )}
      </section>

      {/* 🗓 Календарь-заглушка */}
      <section className="card calendar-placeholder" style={{ textAlign: 'center', background: '#eee' }}>
        <h3>Upcoming Events</h3>
        <CalendarView events={events} />
      </section>

      <BottomNav />
    </div>
  );
};

export default Home;