import api from './axios';
import type { Donation } from '../types/donation';
import type { Applicant } from '../types/user';

export const fetchActiveDonations = async (): Promise<Donation[]> => {
    const res = await api.get('/donations?status=active'); 
  return res.data.allDonations;
};

export const fetchDonationById = async (donationId: number): Promise<Donation> => {
  const res = await api.get(`/donations/${donationId}`);
  return res.data.donation;
};

export const fetchAllDonations = async (): Promise<Donation[]> => {
  const res = await api.get('/donations'); 
  return res.data.allDonations;
};

export const confirmDonationPayment = async (
  donationId: number,
  amount: number
): Promise<{ msg: string }> => {
  const res = await api.post(`/donations/${donationId}/confirm-payment`, { amount });
  return res.data;
};

export const fetchDonationApplicants = async (
  donationId: number
): Promise<Applicant[]> => {
  const res = await api.get(`/donations/${donationId}/applicants`);
  return res.data.applicants;
};

export const deleteDonation = async (
  donationId: number
): Promise<{ msg: string; donationId: number }> => {
  const res = await api.delete(`/donations/${donationId}`);
  return res.data;
};

export const createDonation = async (
  payload: { title: string; description: string; deadline?: string }
): Promise<{ msg: string; donation: Donation }> => {
  const res = await api.post('/donations', payload);
  return res.data;
};