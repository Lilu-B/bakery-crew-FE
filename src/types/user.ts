// Тип данных для пользователя (User)

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'manager' | 'developer';
  shift?: '1st' | '2nd' | 'night';
  phone?: string;
  isApproved: boolean;
  managerId?: number;
}

// Минимальная информация о подписавшемся на ивент

export interface Applicant {
  id: number;
  name: string;
  shift: '1st' | '2nd' | 'night';
}