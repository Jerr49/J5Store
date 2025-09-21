// store/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import themeReducer from './slices/themeSlice';
import paymentReducer from './slices/paymentSlice';
import shippingReducer from './slices/shippingSlice';

// ---------- Persist Config ----------
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'cart', 'theme', 'payment', 'shipping'], 
};

// ---------- Root Reducer ----------
const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
  theme: themeReducer,
  payment: paymentReducer,
  shipping: shippingReducer,
});

// ---------- Persisted Reducer ----------
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ---------- Store ----------
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);

// ---------- Types ----------
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
