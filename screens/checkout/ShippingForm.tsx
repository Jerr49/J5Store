import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

type ShippingInfo = {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
};

type Props = {
  colors: {
    background: string;
    card: string;
    text: string;
    subtext: string;
    accent: string;
    border: string;
    buttonText: string;
  };
  shippingInfo: ShippingInfo;
  setShippingInfo: React.Dispatch<React.SetStateAction<ShippingInfo>>;
  setActiveSection: React.Dispatch<
    React.SetStateAction<"shipping" | "payment" | "review">
  >;
};

const ShippingForm: React.FC<Props> = ({
  colors,
  shippingInfo,
  setShippingInfo,
  setActiveSection,
}) => {
  const handleChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo({ ...shippingInfo, [field]: value });
  };

  return (
    <ScrollView style={[styles.card, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Shipping Information
      </Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor={colors.subtext}
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        value={shippingInfo.fullName}
        onChangeText={(text) => handleChange("fullName", text)}
      />

      <TextInput
        placeholder="Address"
        placeholderTextColor={colors.subtext}
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        value={shippingInfo.address}
        onChangeText={(text) => handleChange("address", text)}
      />

      <TextInput
        placeholder="City"
        placeholderTextColor={colors.subtext}
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        value={shippingInfo.city}
        onChangeText={(text) => handleChange("city", text)}
      />

      <TextInput
        placeholder="State"
        placeholderTextColor={colors.subtext}
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        value={shippingInfo.state}
        onChangeText={(text) => handleChange("state", text)}
      />

      <TextInput
        placeholder="Zip Code"
        placeholderTextColor={colors.subtext}
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        value={shippingInfo.zipCode}
        onChangeText={(text) => handleChange("zipCode", text)}
      />

      <TextInput
        placeholder="Country"
        placeholderTextColor={colors.subtext}
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        value={shippingInfo.country}
        onChangeText={(text) => handleChange("country", text)}
      />

      <TextInput
        placeholder="Phone Number"
        placeholderTextColor={colors.subtext}
        keyboardType="phone-pad"
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        value={shippingInfo.phone}
        onChangeText={(text) => handleChange("phone", text)}
      />

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={() => setActiveSection("payment")}
      >
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>
          Continue to Payment
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ShippingForm;
