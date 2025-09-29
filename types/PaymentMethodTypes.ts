// types and configurations
export type CardInfo = {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
};

export type DigitalPaymentInfo = {
  email?: string;
  appleId?: string;
  cashappTag?: string;
  phone?: string;
};

export type PaymentMethodType = "card" | "paypal" | "applepay" | "cashapp";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  name: string;
  number?: string;
  expiry?: string;
  cvv?: string;
  isDefault: boolean;
}

export type Colors = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  accent: string;
  border: string;
  buttonText: string;
  success: string;
  error: string;
  warning: string;
};

export const PAYMENT_METHODS = {
  card: {
    label: "Credit/Debit Card",
    icon: "credit-card",
    description: "Pay with Visa, Mastercard, or American Express",
    color: "#000000", // Will be overridden
  },
  paypal: {
    label: "PayPal",
    icon: "paypal",
    description: "Pay with your PayPal account",
    color: "#0070BA",
  },
  applepay: {
    label: "Apple Pay",
    icon: "apple",
    description: "Pay with Apple Pay",
    color: "#000000", // Will be overridden
  },
  cashapp: {
    label: "Cash App",
    icon: "cash",
    description: "Pay with Cash App",
    color: "#00C244",
  },
} as const;