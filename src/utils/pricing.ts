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
      "Full delegate registration for RJMUN 3.0 Model United Nations conference. Includes committee participation, delegate kit, and certificate.",
    price: "1,200",
    note: "Discount coupons may be applicable at the time of registration.",
  },
];

export const pricingNote = `Fest day passes are priced individually and may vary. Please visit the Fest Days page for the latest pricing and details on each day's events.`;

export const paymentMethods = [
  "All payments are processed securely through Razorpay.",
  "We accept UPI, credit cards, debit cards, net banking, and wallets.",
  "You will receive a confirmation email with your registration ID upon successful payment.",
  "For any payment-related issues, please contact us at rjmun2025@gmail.com.",
];
