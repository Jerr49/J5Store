import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../constants/theme";

interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

interface AddressCardProps {
  address: Address;
  isSelected?: boolean; // ✅ new
  onPress?: () => void; // ✅ new
  onEdit?: () => void;
  onDelete?: () => void;
  onPressDefault?: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected = false,
  onPress,
  onEdit,
  onDelete,
  onPressDefault,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[
        styles.card,
        {
          borderColor: isSelected ? colors.primary : colors.border,
          backgroundColor: colors.card,
          shadowColor: colors.text,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
        <Text style={[styles.name, { color: colors.text }]}>{address.fullName}</Text>

        {/* Default badge */}
        {address.isDefault && (
          <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}

        {/* Selection checkmark */}
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={colors.primary}
            style={{ marginLeft: 8 }}
          />
        )}
      </View>

      {/* Details */}
      <View style={styles.cardBody}>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={18} color={colors.secondaryText} />
          <Text style={[styles.text, { color: colors.secondaryText }]}>
            {address.address}, {address.city}, {address.state}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="flag-outline" size={18} color={colors.secondaryText} />
          <Text style={[styles.text, { color: colors.secondaryText }]}>
            {address.country} - {address.postalCode}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="call-outline" size={18} color={colors.secondaryText} />
          <Text style={[styles.text, { color: colors.secondaryText }]}>{address.phone}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {/* Only show "Set Default" if not already default AND not currently selected */}
        {onPressDefault && !address.isDefault && !isSelected && (
          <TouchableOpacity onPress={onPressDefault} style={styles.actionBtn}>
            <Ionicons name="star-outline" size={22} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Set Default</Text>
          </TouchableOpacity>
        )}

        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
            <Ionicons name="create-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}

        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={22} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  name: { fontSize: 16, fontWeight: "600", marginLeft: 8 },
  defaultBadge: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  defaultText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  cardBody: { gap: 6 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  text: { marginLeft: 6, fontSize: 14 },
  actions: {
    flexDirection: "row",
    marginTop: 14,
    justifyContent: "flex-end",
    gap: 18,
    flexWrap: "wrap",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "500",
  },
});

export default AddressCard;
