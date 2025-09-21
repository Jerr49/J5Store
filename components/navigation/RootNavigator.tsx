// components/navigation/RootNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { View, ActivityIndicator } from "react-native";

import MainNavigator from "./MainNavigator";
import CheckoutScreen from "../../screens/checkout/CheckoutScreen";
import { RootState } from "../../store";

export type AppRootStackParamList = {
  Main: undefined;      // Main stack (auth & app)
  Checkout: undefined;  // Checkout screen
};

const Stack = createStackNavigator<AppRootStackParamList>();

const RootNavigator = () => {
  const isHydrated = useSelector((state: RootState) => state._persist?.rehydrated);

  if (!isHydrated) {
    // Show splash/loading screen while persisted state is loading
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* MainNavigator handles auth/app routing */}
      <Stack.Screen name="Main" component={MainNavigator} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
