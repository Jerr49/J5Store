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
}

interface AddressCardProps {
  address: Address;
  onEdit?: () => void;
  onDelete?: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit, onDelete }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { borderColor: colors.border, backgroundColor: colors.card, shadowColor: colors.text },
      ]}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
        <Text style={[styles.name, { color: colors.text }]}>{address.fullName}</Text>
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
        {onEdit && (
          <TouchableOpacity onPress={onEdit}>
            <Ionicons name="create-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-outline" size={22} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </View>
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
  },
  name: { fontSize: 16, fontWeight: "600", marginLeft: 8 },
  cardBody: { gap: 6 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  text: { marginLeft: 6, fontSize: 14 },
  actions: {
    flexDirection: "row",
    marginTop: 14,
    justifyContent: "flex-end",
    gap: 18,
  },
});

export default AddressCard;
