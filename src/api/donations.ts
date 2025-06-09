import api from './axios';
import type { Donation } from '../types/donation';
import type { Applicant } from '../types/user';

// 🔹 Получение активных донатов (используется на главной и на странице всех донатов)
export const fetchActiveDonations = async (): Promise<Donation[]> => {
  // const res = await api.get('/donations/active');
    const res = await api.get('/donations?status=active'); 
  return res.data.allDonations;
};

// 🔹 Получение доната по ID (используется в DonationDetails)
export const fetchDonationById = async (donationId: number): Promise<Donation> => {
  const res = await api.get(`/donations/${donationId}`);
  return res.data.donation;
};

// 🔹 Получение списка всех донатов (используется на странице всех донатов)
export const fetchAllDonations = async (): Promise<Donation[]> => {
  const res = await api.get('/donations');  // этот запрос содержит hasDonated
  return res.data.allDonations;
};

// 🔹 Подтверждение пожертвования (используется при отправке суммы)
export const confirmDonationPayment = async (
  donationId: number,
  amount: number
): Promise<{ msg: string }> => {
  const res = await api.post(`/donations/${donationId}/confirm-payment`, { amount });
  return res.data;
};

// 🔹 Получение списка участников (donors)
export const fetchDonationApplicants = async (
  donationId: number
): Promise<Applicant[]> => {
  const res = await api.get(`/donations/${donationId}/applicants`);
  return res.data.applicants;
};

// 🔹 Удаление доната (доступно для создателя или developer)
export const deleteDonation = async (
  donationId: number
): Promise<{ msg: string; donationId: number }> => {
  const res = await api.delete(`/donations/${donationId}`);
  return res.data;
};

// 🔹 Создание доната
export const createDonation = async (
  payload: { title: string; description: string; deadline?: string }
): Promise<{ msg: string; donation: Donation }> => {
  const res = await api.post('/donations', payload);
  return res.data;
};