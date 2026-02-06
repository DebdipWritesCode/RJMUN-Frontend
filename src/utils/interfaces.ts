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
