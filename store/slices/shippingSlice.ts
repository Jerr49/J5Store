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
  isDefault?: boolean;
}

interface ShippingState {
  addresses: ShippingAddress[];
  selectedAddress: ShippingAddress | null;
}

const initialState: ShippingState = {
  addresses: [],
  selectedAddress: null,
};

const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<ShippingAddress>) => {
      if (state.addresses.length === 0) {
        // First address → auto default & select
        const newAddress = { ...action.payload, isDefault: true };
        state.addresses.push(newAddress);
        state.selectedAddress = newAddress;
      } else {
        const newAddress = { ...action.payload, isDefault: false };
        state.addresses.push(newAddress);
      }
    },
    updateAddress: (state, action: PayloadAction<ShippingAddress>) => {
      const index = state.addresses.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        const isDefault = state.addresses[index].isDefault;
        const updated = { ...action.payload, isDefault };
        state.addresses[index] = updated;

        if (state.selectedAddress?.id === updated.id) {
          state.selectedAddress = updated;
        }
      }
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      const wasSelected = state.selectedAddress?.id === action.payload;
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);

      if (
        state.addresses.length > 0 &&
        !state.addresses.some((a) => a.isDefault)
      ) {
        state.addresses[0].isDefault = true;
      }

      if (wasSelected) {
        state.selectedAddress =
          state.addresses.length > 0 ? state.addresses[0] : null;
      }
    },
    setDefaultAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.map((a) =>
        a.id === action.payload
          ? { ...a, isDefault: true }
          : { ...a, isDefault: false }
      );

      state.selectedAddress =
        state.addresses.find((a) => a.id === action.payload) || null;
    },
    selectAddress: (state, action: PayloadAction<string>) => {
      state.selectedAddress =
        state.addresses.find((a) => a.id === action.payload) || null;
    },
    clearAddresses: (state) => {
      state.addresses = [];
      state.selectedAddress = null;
    },
  },
});

export const {
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
  selectAddress,
  clearAddresses,
} = shippingSlice.actions;

export default shippingSlice.reducer;
