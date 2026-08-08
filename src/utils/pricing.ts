export interface PricingItem {
  title: string;
  description: string;
  earlyBirdPrice: string;
  regularPrice: string;
  note?: string;
}

export const pricingItems: PricingItem[] = [
  {
    title: "MUN Registration",
    description:
      "Full delegate registration for RJMUN 3.0, including the delegate kit, lunch, and high tea.",
    earlyBirdPrice: "1,000",
    regularPrice: "1,200",
    note: "Early-bird pricing ends at 12:00 AM IST on 18 August 2026.",
  },
];

export const festPricingItems: PricingItem[] = [
  {
    title: "One-day DESTINIQUE Pass",
    description:
      "Entry to one DESTINIQUE fest day, including lunch and high tea.",
    earlyBirdPrice: "400",
    regularPrice: "500",
  },
  {
    title: "Two-day DESTINIQUE Pass",
    description:
      "Entry to both DESTINIQUE fest days, including lunch and high tea on both days.",
    earlyBirdPrice: "800",
    regularPrice: "1,000",
  },
];

export const paymentMethods = [
  "Pay the exact amount shown on the registration form using the official QR code or bank details.",
  "After payment, send your payment receipt on WhatsApp with the participant's name and email address.",
  "A registration paid with an incorrect amount will not be considered, and the payment will not be refunded.",
  "For payment help, WhatsApp 9340187056.",
];
