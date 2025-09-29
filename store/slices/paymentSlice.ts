// store/slices/paymentSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PaymentMethod = {
  id: string;
  type: "card" | "paypal" | "applepay" | "cashapp";
  name: string;
  number?: string;
  isDefault: boolean;
  expiry?: string;
  cvv?: string;
  brand?: string;
};

type PaymentState = {
  methods: PaymentMethod[];
  selectedPaymentId?: string; // new: currently selected payment
};

const initialState: PaymentState = {
  methods: [
    { id: "1", type: "card", name: "Visa", number: "1234", isDefault: true },
    { id: "2", type: "paypal", name: "PayPal", isDefault: false },
  ],
  selectedPaymentId: undefined,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    addMethod: (state, action: PayloadAction<PaymentMethod>) => {
      // If first method, make it default
      if (state.methods.length === 0) {
        action.payload.isDefault = true;
      }
      state.methods.push(action.payload);
    },
    removeMethod: (state, action: PayloadAction<string>) => {
      state.methods = state.methods.filter((m) => m.id !== action.payload);
      // If the default was removed, set the first method as default
      if (!state.methods.some((m) => m.isDefault) && state.methods.length > 0) {
        state.methods[0].isDefault = true;
      }
      // If removed method was selected, clear selection
      if (state.selectedPaymentId === action.payload) {
        state.selectedPaymentId = undefined;
      }
    },
    setDefaultMethod: (state, action: PayloadAction<string>) => {
      state.methods = state.methods.map((m) => ({
        ...m,
        isDefault: m.id === action.payload,
      }));
    },
    selectPaymentMethod: (state, action: PayloadAction<string>) => {
      state.selectedPaymentId = action.payload;
    },
  },
});

export const { addMethod, removeMethod, setDefaultMethod, selectPaymentMethod } = paymentSlice.actions;
export default paymentSlice.reducer;
