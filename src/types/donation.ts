export interface Donation {
  id: number;
  title: string;
  description: string;
  deadline: string;            
  createdBy: number;
  createdAt: string;
  status: 'active' | 'expired';
  creatorName: string;

  totalCollected?: number;
  donorCount?: number;
  hasDonated?: boolean;
}