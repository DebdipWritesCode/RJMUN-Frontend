// EB
export interface EB {
  _id: string;
  name: string;
  position: string;
  committee: string;
  image?: string; // base64 or URL (after conversion)
  imageMimeType?: string;
}

// Team Member
export interface TeamMember {
  _id: string;
  name: string;
  position: string;
  type: "super" | "head" | "manager";
  image?: string;
  imageMimeType?: string;
}

// Committee
export interface Committee {
  _id: string;
  name: string;
  agenda: string;
  backgroundGuideURL?: string;
  image?: string;
  imageMimeType?: string;
  portfolios?: string[];
}

// Sponsor
export type SponsorType = "partner" | "college" | "endorsement";

export interface Sponsor {
  _id: string;
  name: string;
  type: SponsorType;
  image?: string;
  imageMimeType?: string;
}

// FAQ
export interface FAQ {
  _id: string;
  question: string;
  answer: string;
}
