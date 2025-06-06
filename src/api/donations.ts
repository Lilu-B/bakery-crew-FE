import api from './axios';
import type { Donation } from '../types/donation';

export const fetchActiveDonations = async (): Promise<Donation[]> => {
  const res = await api.get('/donations/active');
  return res.data.donations;
};