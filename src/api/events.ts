import api from './axios';
import type { Event } from '../types/event';

// Получение списка событий
export const fetchEvents = async (): Promise<Event[]> => {
  const res = await api.get('/events');   // обращаемся к бэкенду
  return res.data.events;   // возвращаем массив событий
};

// Получение деталей события
export const fetchEventById = async (eventId: number): Promise<Event> => {
  const res = await api.get(`/events/${eventId}`);
  return res.data;
};
export const applyToEvent = (eventId: number) =>
  api.post(`/events/${eventId}/apply`);
