import { cache } from './cache';
import { Product, Testimonial } from '../types';

export const fetchTrendingProducts = async (): Promise<Product[]> => {
  const cacheKey = 'trending-products';
  
  if (!cache.isExpired(cacheKey)) {
    return cache.get(cacheKey).data;
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const data: Product[] = [
        { id: 1, name: "Summer Collection 1", price: 59.99, rating: 4, reviews: 120, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f" },
        { id: 2, name: "Summer Collection 2", price: 69.99, rating: 5, reviews: 143, image: "https://images.unsplash.com/photo-1525299374597-911581e1bdef" },
        { id: 3, name: "Summer Collection 3", price: 79.99, rating: 4, reviews: 166, image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5" },
        { id: 4, name: "Summer Collection 4", price: 89.99, rating: 5, reviews: 189, image: "https://images.unsplash.com/photo-1544441893-675973e31985" },
      ];
      cache.set(cacheKey, data, 300000);
      resolve(data);
    }, 500);
  });
};

export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  const cacheKey = 'testimonials';
  
  if (!cache.isExpired(cacheKey)) {
    return cache.get(cacheKey).data;
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const data: Testimonial[] = [
        { 
          id: 1, 
          text: "StyleHub has completely transformed my shopping experience. The quality is exceptional and delivery is always on time!", 
          author: "Sarah Johnson", 
          title: "Fashion Influencer", 
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" 
        },
        { 
          id: 2, 
          text: "I've never experienced such personalized service from an online store. The recommendations are always spot on!", 
          author: "Michael Chen", 
          title: "Style Blogger", 
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" 
        },
        { 
          id: 3, 
          text: "The customer service is outstanding and the return policy is so hassle-free. I shop with confidence now!", 
          author: "Emma Rodriguez", 
          title: "Fashion Designer", 
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" 
        },
      ];
      cache.set(cacheKey, data, 600000);
      resolve(data);
    }, 500);
  });
};