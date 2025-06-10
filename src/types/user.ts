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

export interface Applicant {
  id: number;
  name: string;
  shift: '1st' | '2nd' | 'night';
}

export interface Donor {
  id: number;
  name: string;
  amount: number;
}