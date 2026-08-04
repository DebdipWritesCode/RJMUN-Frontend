export interface PricingItem {
  title: string;
  description: string;
  price: string;
  note?: string;
}

export const pricingItems: PricingItem[] = [
  {
    title: "MUN Registration",
    description:
      "Full delegate registration for RJMUN 3.0, including the delegate kit, lunch, and high tea.",
    price: "1,200",
    note: "Priority registrations are available for ₹1,000 while the priority window is open.",
  },
];

export const festPricingItems: PricingItem[] = [
  {
    title: "One-day DESTINIQUE Pass",
    description:
      "Entry to one DESTINIQUE fest day, including lunch and high tea.",
    price: "500",
  },
  {
    title: "Two-day DESTINIQUE Pass",
    description:
      "Entry to both DESTINIQUE fest days, including lunch and high tea on both days.",
    price: "1,000",
  },
];

export const paymentMethods = [
  "All payments are processed securely through Razorpay.",
  "We accept UPI, credit cards, debit cards, net banking, and wallets.",
  "You will receive a confirmation email with your registration ID upon successful payment.",
  "For any payment-related issues, please contact us at xyaa.33@gmail.com.",
];
