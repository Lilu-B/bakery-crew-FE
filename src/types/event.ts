// Тип данных события (Event)

export interface Event {
  id: number;
  title: string;
  description: string | null;
  date: string;
  shift: string;
  createdBy: number;
  createdAt: string;
  status: string;
  creatorName: string;
  applied?: boolean; // только для пользователей (user)
}

export interface CalendarViewProps {
  events: Event[];
}