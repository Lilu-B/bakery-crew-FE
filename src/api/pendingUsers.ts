// src/api/pendingUsers.ts
import api from './axios';
import type { User } from '../types/user';

// Получить всех пользователей, ожидающих подтверждения
export const fetchPendingUsers = async (): Promise<User[]> => {
  const res = await api.get('/admin/users/pending');
  return res.data.users;
};

// Подтвердить пользователя по ID
export const approveUserById = async (id: number): Promise<void> => {
  await api.patch(`/admin/users/${id}/approve`);
};

// Удалить (отклонить) пользователя по ID
export const deleteUserById = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};