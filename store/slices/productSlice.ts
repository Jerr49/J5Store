// store/slices/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, Category } from '../../types';
import { productsAPI } from '../../data/api'; // ✅ Import from external file

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  newArrivals: Product[];
  trendingProducts: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  newArrivals: [],
  trendingProducts: [],
  categories: [],
  loading: false,
  error: null,
};

// ✅ Use the external API call
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    return await productsAPI.getProducts();
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.products = state.products.map(product =>
        product.id === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      );
      state.featuredProducts = state.featuredProducts.map(product =>
        product.id === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      );
      state.newArrivals = state.newArrivals.map(product =>
        product.id === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      );
      state.trendingProducts = state.trendingProducts.map(product =>
        product.id === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.categories = action.payload.categories;
        
        // Filter featured products (high rating and good reviews)
        state.featuredProducts = action.payload.products.filter(
          product => product.rating >= 4.5 && product.reviewCount >= 100
        );
        
        // Filter new arrivals
        state.newArrivals = action.payload.products.filter(
          product => product.isNew
        );
        
        // Filter trending products (good rating and recent)
        state.trendingProducts = action.payload.products.filter(
          product => product.rating >= 4.3 && product.reviewCount >= 50
        ).slice(0, 8);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });
  },
});

export const { toggleFavorite } = productSlice.actions;
export default productSlice.reducer;