import React, { useEffect, useCallback } from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { View, ActivityIndicator } from "react-native";
import "react-native-get-random-values";
import "react-native-gesture-handler";
import "react-native-reanimated";

import store, { persistor } from "./store";
import RootNavigator from "./components/navigation/RootNavigator";
import { PersistGate } from "redux-persist/integration/react";
import { useAppSelector } from "./store/hooks";
import { DarkTheme, LightTheme } from "./constants/theme";

// 👇 prevent splash from hiding too soon
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  // hide splash once fonts are ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // keep splash screen until fonts are ready
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate
          loading={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" />
            </View>
          }
          persistor={persistor}
        >
          <AppContent />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : LightTheme}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <RootNavigator />
    </NavigationContainer>
  );
}
