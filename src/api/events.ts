import api from './axios';
import type { Event } from '../types/event';

export const fetchEvents = async (): Promise<Event[]> => {
  const res = await api.get('/events');  
  return res.data.events;   
};

export const fetchEventById = async (eventId: number): Promise<Event> => {
  const res = await api.get(`/events/${eventId}`);
  return res.data;
};

export const applyToEvent = async (eventId: number): Promise<{ msg: string }> => {
  const res = await api.post(`/events/${eventId}/apply`);
  return res.data;
};

export const deleteEvent = async (eventId: number): Promise<{ msg: string; eventId: number }> => {
  const res = await api.delete(`/events/${eventId}`);
  return res.data;
};

export const createEvent = async (
  payload: { title: string; date: string; shift: string; description?: string }
): Promise<{ msg: string; event: Event }> => {
  const res = await api.post('/events', payload);
  return res.data;
};