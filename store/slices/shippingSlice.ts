import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ShippingState {
  addresses: ShippingAddress[];
}

const initialState: ShippingState = {
  addresses: [],
};

const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.addresses.push(action.payload);
    },
    updateAddress: (state, action: PayloadAction<ShippingAddress>) => {
      const index = state.addresses.findIndex(
        (a) => a.id === action.payload.id
      );
      if (index !== -1) state.addresses[index] = action.payload;
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);
    },
  },
});

export const { addAddress, updateAddress, removeAddress } =
  shippingSlice.actions;
export default shippingSlice.reducer;
