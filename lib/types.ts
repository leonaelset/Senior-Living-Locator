// lib/types.ts
export type City = 'Houston' | 'Austin' | 'San Antonio';
export type CareType = 'Independent Living' | 'Assisted Living' | 'Memory Care' | 'Skilled Nursing';
export type BudgetRange = 'Under $2,000' | '$2,000 – $3,500' | '$3,500 – $5,000' | '$5,000+' | 'Not sure';

export interface Community {
  id: string;
  slug: string;
  name: string;
  city: City;
  address: string;
  careTypes: CareType[];
  priceMin: number;
  priceMax: number;
  description: string;
  amenities: string[];
  images: string[];
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
}

export interface Lead {
  id: string;
  communityId: string;
  communityName: string;
  name: string;
  phone: string;
  email: string;
  whoFor: 'Myself' | 'Parent' | 'Spouse' | 'Other';
  notes: string;
  status: 'New' | 'Contacted' | 'Placed';
  createdAt: Date;
}

export interface LeadFormData {
  name: string
  phone: string
  email: string
  whoFor: 'Myself' | 'Parent' | 'Spouse' | 'Other'
  notes: string
  communitySlug: string
  communityName: string
}