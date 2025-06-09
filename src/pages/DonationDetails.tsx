// pages/DonationDetails.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
// import { 
//     fetchDonationById, 
//     confirmDonationPayment, 
//     deleteDonation } from '../api/donations';
import BottomNav from '../components/BottomNav';
import ProfileMenu from '../components/ProfileMenu';
import { format } from 'date-fns';
import api from '../api/axios';
import type { AxiosError } from 'axios';
import type { Donation } from '../types/donation';

const DonationDetails = () => {
  const { donationId } = useParams<{ donationId: string }>();
  const { user } = useUser();
  const navigate = useNavigate();
  const [donation, setDonation] = useState<Donation | null>(null);

  const [amount, setAmount] = useState('');
//   const [hasDonated, setHasDonated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = Number(donationId);
  const isInvalid = !donationId || isNaN(id);

  useEffect(() => {
    if (isInvalid) {
      setError('Donation not found');
      navigate('/donations');
      return;
    }

    const loadDonation = async () => {
    try {
        const res = await api.get(`/donations/${id}`);
console.log('👉 Получено с сервера:', res.data);
        setDonation(res.data.donation);
        // setHasDonated(res.data.donation.has_donated || false);
    } catch (err) {
        const error = err as AxiosError<{ msg?: string }>;
        alert(error.response?.data?.msg || 'Error loading donation');
    } finally {
        setLoading(false);
    }
    };

    loadDonation();
  }, [isInvalid, navigate]);

  const handleDonate = async () => {
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return alert('Please enter a valid donation amount');
    }

    try {
      const res = await api.post(`/donations/${id}/confirm-payment`, { amount: numericAmount });
      alert(res.data.msg);
    //   setHasDonated(true);
      setAmount('');

      // 🔄 обновляем сбор после пожертвования
      const updated = await api.get(`/donations/${id}`);
      setDonation(updated.data.donation);
    } catch (err) {
      const error = err as AxiosError<{ msg?: string }>;
      alert(error.response?.data?.msg || '❌ Failed to donate');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;
    try {
      const res = await api.delete(`/donations/${id}`);
      alert(res.data.msg);
      navigate('/donations');
    } catch (err) {
      const error = err as AxiosError<{ msg?: string }>;
      alert(error.response?.data?.msg || '❌ Failed to delete donation');
    }
  };

  if (loading || !donation) return <p>Loading donation...</p>;
  if (error) return <p aria-live="assertive" style={{ color: 'red' }}>{error}</p>;

  return (
    <main role="main" className="donation-details">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Bakery Crew Hub</h1>
        <ProfileMenu />
      </header>

      <h2>{donation.title}</h2>
      <p>Deadline: {format(new Date(donation.deadline), 'd MMM yyyy')}</p>
      <p style={{ color: '#666' }}>Created by: {donation.creatorName}</p>
      <p>{donation.description}</p>

      <h3>Total Donated: £{donation.totalCollected}</h3>
      <h4>Donors: {donation.donorCount}</h4>

      {user?.role === 'user' && !donation.hasDonated && (
        <>

        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="donation-amount">Donation amount (£)</label>
          <input
            type="number"
            id="donation-amount"
            placeholder="Enter amount (£)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
          <button onClick={handleDonate} aria-label="Donate" className="btn-green">
            Donate
          </button>
        </div>
        </>
      )}

      {donation.hasDonated && (
        <p aria-live="polite" style={{ color: 'green' }}>✅ Thank you for your donation!</p>
      )}

      {user?.role !== 'user' && (
        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
          <button onClick={handleDelete} aria-label="Delete donation" className="btn-red">DELETE</button>
        </div>
      )}

      <BottomNav />
    </main>
  );
};

export default DonationDetails;
