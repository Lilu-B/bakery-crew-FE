import api from './axios';

export const fetchEvents = async () => {
  const res = await api.get('/events');
  return res.data.events;
};