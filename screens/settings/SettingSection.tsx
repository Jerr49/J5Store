import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../constants/theme";

type Props = { title: string; children: React.ReactNode };

const SettingSection: React.FC<Props> = ({ title, children }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text, borderBottomColor: colors.border }]}>{title}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 16, borderRadius: 12, marginHorizontal: 16, overflow: "hidden" },
  title: { fontSize: 18, fontWeight: "600", padding: 20, paddingBottom: 16, borderBottomWidth: 1 },
});

export default SettingSection;
