// types/index.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  isNew: boolean;
  reviewCount: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  isFavorite: boolean;
  brand?: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  avatar?: string;
  phone?: string;
  address?: string;
  
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CreditCardData {
  valid: boolean;
  values: {
    number: string;
    type: string;
  };
}