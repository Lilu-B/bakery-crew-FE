import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { fetchActiveDonations } from '../api/donations';
import BottomNav from '../components/BottomNav';
import ProfileMenu from '../components/ProfileMenu';
import { format } from 'date-fns';
import type { AxiosError } from 'axios';
import type { Donation } from '../types/donation';

const Donations = () => {
  const { user, loading } = useUser();       
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loadingDonations, setLoadingDonations] = useState(true);

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const data = await fetchActiveDonations(); 
        const sorted = data.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        setDonations(sorted);                  
      } catch (err) {
        const error = err as AxiosError<{ msg?: string }>;
        alert(error.response?.data?.msg || 'Failed to load donations');
      } finally {
        setLoadingDonations(false);
      }
    };

    loadDonations();
  }, []);

  if (loading || loadingDonations) return <p>Loading donations...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="donations-page">
      <header className="fixed-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Bakery Crew Hub</h1>
        <ProfileMenu />
      </header>

      
      {donations.length === 0 ? (
        <p>No active donations</p>
      ) : (
        donations.map((donation) => {
          const cardClass =
            donation.hasDonated === false ? 'card active clickable' : 'card clickable';

          return (
            <div
              key={donation.id}
              className={cardClass}
              onClick={() => navigate(`/donations/${donation.id}`)}
              role="button"
              tabIndex={0}
              aria-label={`View donation ${donation.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/donations/${donation.id}`);
                }
              }}
            >
              <h3>{donation.title}</h3>
              <p>Deadline: {format(new Date(donation.deadline), 'd MMM yyyy')}</p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>
                Created by: {donation.creatorName}
              </p>
            </div>
          );
        })
      )}

      {user.role !== 'user' && (
        <button
          onClick={() => navigate('/donations/create')}
          aria-label='Create new donation'
          style={{
            marginTop: '1rem',
            background: '#green',
            padding: '1rem',
            borderRadius: '8px',
            width: '100%',
          }}
        >
          Create Donation
        </button>
      )}

      <div className="fixed-footer">
        <BottomNav />
      </div>
    </div>
  );
};

export default Donations;