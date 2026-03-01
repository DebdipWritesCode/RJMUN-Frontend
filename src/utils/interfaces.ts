// EB
export interface EB {
  _id: string;
  name: string;
  position: string;
  committee: string;
  imageUrl?: string | null;
}

// Team Member
export interface TeamMember {
  _id: string;
  name: string;
  position: string;
  type: "super" | "head" | "manager";
  imageUrl?: string | null;
}

// Committee
export interface Committee {
  _id: string;
  name: string;
  agenda: string;
  backgroundGuideURL?: string;
  imageUrl?: string | null;
  portfolios?: string[];
}

// Sponsor
export type SponsorType = "partner" | "college" | "endorsement";

export interface Sponsor {
  _id: string;
  name: string;
  type: SponsorType;
  imageUrl?: string | null;
}

// FAQ
export interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

// Fest Day (admin CRUD + user list)
export interface FestDayEvent {
  title: string;
  description?: string;
  imageUrl?: string;        // NEW: URL to the event image on Cloudinary
  imagePublicId?: string;    // NEW: Public ID for deletion/updates
}

export interface FestDay {
  _id: string;
  date: string;
  name: string;
  /** Plain text description for the fest day */
  description: string;
  price: number;
  imageUrl?: string;
  imagePublicId?: string;
  events?: FestDayEvent[];
}

// Multi-day offers: keys = number of days (as string), values = percentage off
export type FestDayOffers = Record<string, number>;

// Day registration – public days + offers
export interface DayRegistrationDaysResponse {
  days: FestDay[];
  offers: FestDayOffers;
}
