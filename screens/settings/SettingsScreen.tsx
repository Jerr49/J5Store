import React, { useState } from "react";
import { ScrollView, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { toggleTheme } from "../../store/slices/themeSlice";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../components/navigation/MainNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

import SettingSection from "./SettingSection";
import SettingItem from "./SettingItem";
import LogoutButton from "./LogoutButton";
import ThemeSwitch from "./ThemeSwitch";
import SettingsHeader from "./SettingsHeader";
import SettingsInfo from "./SettingsInfo";
import { useTheme } from "../../constants/theme";
import { ICONS } from "./icons";

const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { colors, isDark } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [language] = useState("English");
  const [currency] = useState("USD");

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        onPress: () => {
          // 🔑 Redux will update isAuthenticated → MainNavigator will switch to AuthStack
          dispatch(logout());
        },
        style: "destructive",
      },
    ]);
  };

  const handleThemeToggle = () => dispatch(toggleTheme());

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <SettingsHeader />

        <SettingSection title="App Preferences">
          <SettingItem
            icon={ICONS.notifications}
            name="Push Notifications"
            rightComponent={
              <ThemeSwitch value={notifications} onValueChange={setNotifications} />
            }
          />
          <SettingItem
            icon={ICONS.darkMode}
            name="Dark Mode"
            rightComponent={<ThemeSwitch value={isDark} onValueChange={handleThemeToggle} />}
          />
          <SettingItem
            icon={ICONS.biometric}
            name="Biometric Login"
            rightComponent={<ThemeSwitch value={biometricAuth} onValueChange={setBiometricAuth} />}
          />
        </SettingSection>

        <SettingSection title="Account Settings">
          <SettingItem
            icon={ICONS.password}
            name="Change Password"
            onPress={() => navigation.navigate("ChangePassword")}
          />
          <SettingItem
            icon={ICONS.payment}
            name="Payment Methods"
            onPress={() => navigation.navigate("PaymentMethods")}
          />
          <SettingItem
            icon={ICONS.shipping}
            name="Shipping Addresses"
            onPress={() => navigation.navigate("ShippingAddresses")}
          />
          <SettingItem
            icon={ICONS.orders}
            name="Order History"
            onPress={() => navigation.navigate("OrderHistory")}
          />
        </SettingSection>

        <SettingSection title="App Settings">
          <SettingItem
            icon={ICONS.language}
            name="Language"
            description={language}
            onPress={() => navigation.navigate("LanguageSettings")}
          />
          <SettingItem
            icon={ICONS.currency}
            name="Currency"
            description={currency}
            onPress={() => navigation.navigate("CurrencySettings")}
          />
          <SettingItem
            icon={ICONS.dataUsage}
            name="Data Usage"
            description="Wi-Fi only for downloads"
            onPress={() => {}}
          />
        </SettingSection>

        <SettingSection title="Support & About">
          <SettingItem
            icon={ICONS.help}
            name="Help Center"
            onPress={() => navigation.navigate("HelpCenter")}
          />
          <SettingItem
            icon={ICONS.contact}
            name="Contact Support"
            onPress={() => navigation.navigate("ContactSupport")}
          />
          <SettingItem
            icon={ICONS.privacy}
            name="Privacy Policy"
            onPress={() => navigation.navigate("PrivacyPolicy")}
          />
          <SettingItem
            icon={ICONS.terms}
            name="Terms of Service"
            onPress={() => navigation.navigate("TermsOfService")}
            isLast
          />
        </SettingSection>

        <SettingsInfo />
        <LogoutButton onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
