import api from './axios';
import type { User } from '../types/user';

export const fetchPendingUsers = async (): Promise<User[]> => {
  const res = await api.get('/admin/users/pending');
  return res.data.users;
};

export const approveUserById = async (id: number): Promise<void> => {
  await api.patch(`/admin/users/${id}/approve`);
};

export const deleteUserById = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};