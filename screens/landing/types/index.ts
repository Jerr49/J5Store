import { StackNavigationProp } from "@react-navigation/stack";
import { Animated } from "react-native";
import { RootStackParamList } from "../../../components/navigation/MainNavigator";

export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
}

export interface Testimonial {
  id: number;
  text: string;
  author: string;
  title: string;
  image: string;
}

export interface TrendingItemProps {
  item: Product;
  onPress: (item: Product) => void;
}

export interface TestimonialItemProps {
  testimonial: Testimonial;
}

export type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Landing'>;

export interface AnimationValues {
  scrollY: Animated.Value;
  fadeAnim: Animated.Value;
  featureAnim1: Animated.Value;
  featureAnim2: Animated.Value;
  featureAnim3: Animated.Value;
  trendingAnim: Animated.Value;
  buttonScale: Animated.Value;
  pulseAnim: Animated.AnimatedInterpolation<number>;
  screenTransitionAnim: Animated.Value;
}