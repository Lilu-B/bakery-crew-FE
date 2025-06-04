import api from './axios';

export const fetchActiveDonations = async () => {
  const res = await api.get('/donations/active');
  return res.data.donations;
};