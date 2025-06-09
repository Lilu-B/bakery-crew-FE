// types/donation.ts

export interface Donation {
  id: number;
  title: string;
  description: string;
  deadline: string;              // ISO-строка (можно преобразовать через new Date)
  createdBy: number;
  createdAt: string;
  status: 'active' | 'expired';
  creatorName: string;

  // 👇 эти поля приходят только в некоторых запросах (например, getDonationById)
  totalCollected?: number;
  donorCount?: number;
  hasDonated?: boolean;
}