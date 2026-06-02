export interface RSVPPayload {
  name: string;
  phone: string;
  guestsCount: number;
  attendingEngagement: boolean;
  attendingWedding: boolean;
  message: string;
  createdAt: string;
}

export interface GuestWish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export interface TimelineEvent {
  title: string;
  date: string;
  description: string;
  icon: string;
}

export interface FamilyMember {
  role: string;
  name: string;
  details?: string;
  relation?: string;
  company?: string;
}
