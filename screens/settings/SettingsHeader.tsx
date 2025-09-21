import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../constants/theme";

const SettingsHeader: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Manage your account preferences</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { padding: 20, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 16 },
});

export default SettingsHeader;
