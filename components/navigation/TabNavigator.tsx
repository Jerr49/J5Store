// components/navigation/TabNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../screens/home/HomeScreen";
import ProductDetailScreen from "../../screens/product/ProductDetailScreen";
import OrdersScreen from "../../screens/order/OrdersScreen";
import ProfileScreen from "../../screens/profile/ProfileScreen";
import SettingsScreen from "../../screens/settings/SettingsScreen";
import CartScreen from "../../screens/cart/CartScreen";
import AppNavbar from "./AppNavbar";
import { Product } from "../../types";

// Tab params
export type TabParamList = {
  HomeTab: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
  Settings: undefined;
};

// Home stack params
export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: { productId: string };
  Checkout: { product?: Product };
};

// Navigators
const Tab = createBottomTabNavigator<TabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();

// Home stack
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </HomeStack.Navigator>
  );
};

// Main Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator tabBar={(props) => <AppNavbar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ tabBarLabel: "Home" }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarLabel: "Cart" }} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
