import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { Picker } from "@react-native-picker/picker";
import { useDispatch } from "react-redux";
import { updateAddress } from "../../../store/slices/shippingSlice";
import { useTheme } from "../../../constants/theme";
import { countryStates } from "../../../constants/countrystates";

// ---------- Types ----------
export type Address = {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type EditAddressScreenProps = {
  route: { params: { address: Address } };
  navigation: { goBack: () => void };
};

// ---------- Reusable Input Field ----------
const InputField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  maxLength,
  colors,
}: {
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (val: string) => void;
  keyboardType?: "default" | "phone-pad" | "numeric";
  maxLength?: number;
  colors: any;
}) => (
  <View style={[styles.inputContainer, { borderColor: colors.border }]}>
    <Icon name={icon} size={20} color={colors.secondaryText} />
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={colors.secondaryText}
      value={value}
      onChangeText={(val) => onChangeText(val.trimStart())}
      keyboardType={keyboardType}
      maxLength={maxLength}
      style={[styles.input, { color: colors.text }]}
    />
  </View>
);

// ---------- Main Component ----------
const EditAddressScreen: React.FC<EditAddressScreenProps> = ({
  route,
  navigation,
}) => {
  const { address } = route.params;
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const [form, setForm] = useState<Address>({ ...address });
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>("NG");

  const handleChange = (key: keyof Address, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = () => {
    if (!form.fullName.trim() || !form.address.trim() || !form.country.trim()) {
      return Alert.alert("Error", "Please fill all required fields");
    }
    dispatch(updateAddress(form));
    navigation.goBack();
  };

  const handleCountrySelect = (country: Country) => {
    setCountryCode(country.cca2); // update ISO code
    setForm((prev) => ({
      ...prev,
      country:
        typeof country.name === "string" ? country.name : country.name.common,
      state: "", // reset state
    }));
    setShowCountryPicker(false);
  };

  const availableStates = form.country ? countryStates[form.country] || [] : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Edit Shipping Address
          </Text>

          <InputField
            icon="person-outline"
            placeholder="Full Name"
            value={form.fullName}
            onChangeText={(val) => handleChange("fullName", val)}
            colors={colors}
          />

          <InputField
            icon="call-outline"
            placeholder="Phone Number"
            value={form.phone}
            onChangeText={(val) =>
              handleChange("phone", val.replace(/[^0-9]/g, ""))
            }
            keyboardType="phone-pad"
            maxLength={11}
            colors={colors}
          />

          <InputField
            icon="home-outline"
            placeholder="Street Address"
            value={form.address}
            onChangeText={(val) => handleChange("address", val)}
            colors={colors}
          />

          <InputField
            icon="location-outline"
            placeholder="City"
            value={form.city}
            onChangeText={(val) => handleChange("city", val)}
            colors={colors}
          />

          {/* State Dropdown */}
          {availableStates.length > 0 ? (
            <View
              style={[styles.inputContainer, { borderColor: colors.border }]}
            >
              <Icon name="map-outline" size={20} color={colors.secondaryText} />
              <Picker
                selectedValue={form.state}
                style={{ flex: 1, color: colors.text }}
                dropdownIconColor={colors.text}
                onValueChange={(val) => handleChange("state", val)}
              >
                <Picker.Item label="Select State" value="" />
                {availableStates.map((st) => (
                  <Picker.Item key={st} label={st} value={st} />
                ))}
              </Picker>
            </View>
          ) : (
            <InputField
              icon="map-outline"
              placeholder="State / Province"
              value={form.state}
              onChangeText={(val) => handleChange("state", val)}
              colors={colors}
            />
          )}

          <InputField
            icon="mail-outline"
            placeholder="Postal Code"
            value={form.postalCode}
            onChangeText={(val) =>
              handleChange("postalCode", val.replace(/[^0-9]/g, ""))
            }
            keyboardType="numeric"
            maxLength={6}
            colors={colors}
          />

          {/* Country Picker */}
          <TouchableOpacity
            onPress={() => setShowCountryPicker(true)}
            style={[styles.inputContainer, { borderColor: colors.border }]}
          >
            <Icon name="flag-outline" size={20} color={colors.secondaryText} />
            <Text
              style={[
                styles.input,
                { color: form.country ? colors.text : colors.secondaryText },
              ]}
            >
              {form.country || "Select Country"}
            </Text>
          </TouchableOpacity>

          <CountryPicker
            withFilter
            withFlag
            withCountryNameButton
            withAlphaFilter
            withCallingCode
            visible={showCountryPicker}
            onSelect={handleCountrySelect}
            onClose={() => setShowCountryPicker(false)}
            countryCode={countryCode}
            translation="common"
          />

          {/* Update Button */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleUpdate}
          >
            <Text style={styles.buttonText}>Update Address</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 16 },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 17 },
});

export default EditAddressScreen;
