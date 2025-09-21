import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../constants/theme";
import { Ionicons } from "@expo/vector-icons";

type SettingItemProps = {
  icon: string;
  name: string;
  description?: string;
  rightComponent?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
};

const SettingItem: React.FC<SettingItemProps> = ({ icon, name, description, rightComponent, onPress, isLast = false }) => {
  const { colors } = useTheme();

  const content = (
    <View style={styles.row}>
      <View style={[styles.iconContainer, { backgroundColor: "rgba(102,126,234,0.1)" }]}>
        <Ionicons name={icon as any} size={22} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        {description && <Text style={[styles.description, { color: colors.secondaryText }]}>{description}</Text>}
      </View>
      {rightComponent}
    </View>
  );

  if (onPress) return <TouchableOpacity style={[styles.item, { borderBottomColor: colors.border }, isLast && styles.itemLast]} onPress={onPress}>{content}</TouchableOpacity>;
  return <View style={[styles.item, { borderBottomColor: colors.border }, isLast && styles.itemLast]}>{content}</View>;
};

const styles = StyleSheet.create({
  item: { flexDirection: "row", padding: 20, borderBottomWidth: 1, alignItems: "center" },
  itemLast: { borderBottomWidth: 0 },
  row: { flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "space-between" },
  iconContainer: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 16 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "500", marginBottom: 2 },
  description: { fontSize: 14 },
});

export default SettingItem;
