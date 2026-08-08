export const EARLY_BIRD_DISPLAY_DEADLINE = "18 August 2026, 12:00 AM IST";
export const EARLY_BIRD_ENDS_AT = "2026-08-17T18:30:00.000Z";

export const REGISTRATION_PRICES = {
  mun: {
    earlyBird: 1000,
    regular: 1200,
  },
  fest: {
    earlyBirdPerDay: 400,
    earlyBirdBothDays: 800,
    regularPerDay: 500,
    regularBothDays: 1000,
  },
} as const;

export const formatInr = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const isEarlyBirdActive = (now: Date = new Date()) =>
  now.getTime() < new Date(EARLY_BIRD_ENDS_AT).getTime();
