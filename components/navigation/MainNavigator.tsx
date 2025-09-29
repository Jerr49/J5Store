// components/navigation/MainNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { View, ActivityIndicator } from "react-native";

// Screens
import LandingScreen from "../../screens/landing/LandingScreen";
import LoginScreen from "../../screens/auth/LoginScreen";
import RegisterScreen from "../../screens/auth/RegisterScreen";
import VerifyAccountScreen from "../../screens/auth/VerifyAccountScreen";
import WelcomeScreen from "../../screens/auth/WelcomeScreen";
import TabNavigator from "./TabNavigator";
import ChangePasswordScreen from "../../screens/settings/password/ChangePasswordScreen";
import SettingsScreen from "../../screens/settings/SettingsScreen";
import PaymentMethodsScreen from "../../screens/settings/payment/PaymentMethodsScreen";
import AddPaymentMethodScreen from "../../screens/settings/payment/AddPaymentMethodScreen";
import ShippingAddressesScreen from "../../screens/settings/address/ShippingAdressesScreen";
import AddAddressScreen from "../../screens/settings/address/AddAddressScreen";
import EditAddressScreen from "../../screens/settings/address/EditAddressScreen";
import OrderDetailsScreen from "../../screens/settings/History/OrderHistoryScreen";

// Types
import { Address } from "../../screens/settings/address/EditAddressScreen";
import OrdersScreen from "../../screens/order/OrdersScreen";
import { Order } from "../../data/mockOrdersWithItems";

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
  VerifyAccount: { email: string };
  Welcome: undefined;
  Home: undefined;
  Settings: undefined;
  ChangePassword: undefined;

  // Payment
  PaymentMethods: undefined;
  AddPaymentMethod: undefined;

  // Shipping
  ShippingAddresses: undefined;
  AddAddress: undefined;
  EditAddress: { address: Address };

  // Others
  OrderHistory: undefined;
  OrderDetails: { order: Order };
  LanguageSettings: undefined;
  CurrencySettings: undefined;
  HelpCenter: undefined;
  ContactSupport: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Auth stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Landing" component={LandingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="VerifyAccount" component={VerifyAccountScreen} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
  </Stack.Navigator>
);

// App stack
const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={TabNavigator} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />

    {/* Payment */}
    <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
    <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />

    {/* Shipping */}
    <Stack.Screen
      name="ShippingAddresses"
      component={ShippingAddressesScreen}
    />
    <Stack.Screen name="AddAddress" component={AddAddressScreen} />
    <Stack.Screen name="EditAddress" component={EditAddressScreen} />

    {/* Placeholders */}
    <Stack.Screen name="OrderHistory" component={OrdersScreen} />
    <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    <Stack.Screen name="LanguageSettings" component={() => null} />
    <Stack.Screen name="CurrencySettings" component={() => null} />
    <Stack.Screen name="HelpCenter" component={() => null} />
    <Stack.Screen name="ContactSupport" component={() => null} />
    <Stack.Screen name="PrivacyPolicy" component={() => null} />
    <Stack.Screen name="TermsOfService" component={() => null} />
  </Stack.Navigator>
);

const MainNavigator = () => {
  // Wait for Redux-Persist to hydrate
  const isHydrated = useSelector(
    (state: RootState) => state._persist?.rehydrated
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
};

export default MainNavigator;
