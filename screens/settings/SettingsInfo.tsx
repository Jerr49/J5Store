import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../constants/theme";

const SettingsInfo: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={[styles.infoSection, { backgroundColor: colors.card }]}>
      <Text style={[styles.infoText, { color: colors.text }]}>J5Store v1.0.0</Text>
      <Text style={[styles.infoText, { color: colors.text }]}>© 2024 J5Store. All rights reserved.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  infoSection: { marginBottom: 16, borderRadius: 12, marginHorizontal: 16, padding: 20, alignItems: "center" },
  infoText: { fontSize: 14, marginBottom: 4 },
});

export default SettingsInfo;
