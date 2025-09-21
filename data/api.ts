// data/api.ts
import { Product, Category } from '../types';
import { mockProducts, mockCategories } from './mockProducts';

// For now, we'll use mock data. Later you can replace this with real API calls.
export const productsAPI = {
  async getProducts(): Promise<{ products: Product[]; categories: Category[] }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      products: mockProducts,
      categories: mockCategories,
    };
  },

  // Add more API methods here when you connect to a real backend
  // async getProductById(id: string): Promise<Product> { ... }
  // async createProduct(product: Product): Promise<Product> { ... }
};