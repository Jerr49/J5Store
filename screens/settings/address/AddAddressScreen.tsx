import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { useDispatch } from "react-redux";
import { addAddress } from "../../../store/slices/shippingSlice";
import { useTheme } from "../../../constants/theme";
import { v4 as uuidv4 } from "uuid";
import { countryStates } from "../../../constants/countrystates";
import { Feather } from "@expo/vector-icons";

const { height: screenHeight } = Dimensions.get("window");

// ---------- InputField Component ----------
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
const AddAddressScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const isDarkMode = colors.background === "#000";

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>("NG");
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [modalAnim] = useState(new Animated.Value(screenHeight));
  const [stateSearch, setStateSearch] = useState("");

  const stateListRef = useRef<FlatList>(null);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.fullName || !form.address || !form.country) {
      return Alert.alert("Error", "Please fill all required fields");
    }
    dispatch(addAddress({ id: uuidv4(), ...form }));
    navigation.goBack();
  };

  const handleCountrySelect = (country: Country) => {
    const code = country.cca2 as CountryCode;
    setCountryCode(code);
    setForm((prev) => ({
      ...prev,
      country:
        typeof country.name === "string" ? country.name : country.name.common,
      state: "",
    }));
    setShowCountryPicker(false);
  };

  const availableStates = form.country ? countryStates[form.country] || [] : [];
  const filteredStates = availableStates.filter((st) =>
    st.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const openStateModal = () => {
    setStateModalVisible(true);
    setStateSearch("");
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeStateModal = () => {
    Animated.timing(modalAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setStateModalVisible(false));
  };

  const handleSelectState = (st: string) => {
    handleChange("state", st);
    closeStateModal();
  };

  // Scroll to selected state when modal opens
  useEffect(() => {
    if (stateModalVisible && form.state && stateListRef.current) {
      const index = availableStates.findIndex((st) => st === form.state);
      if (index >= 0) {
        setTimeout(() => {
          stateListRef.current?.scrollToIndex({ index, animated: true });
        }, 50);
      }
    }
  }, [stateModalVisible]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>
          Add Shipping Address
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

        {/* State Selection */}
        <TouchableOpacity
          style={[styles.inputContainer, { borderColor: colors.border }]}
          onPress={availableStates.length > 0 ? openStateModal : undefined}
        >
          <Icon name="map-outline" size={20} color={colors.secondaryText} />
          <Text
            style={[
              styles.input,
              {
                color: form.state
                  ? isDarkMode
                    ? "whitesmoke"
                    : colors.text
                  : colors.secondaryText,
              },
            ]}
          >
            {form.state || "Select State"}
          </Text>
        </TouchableOpacity>

        {/* State Modal */}
        <Modal transparent visible={stateModalVisible} animationType="none">
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "#00000050" }}
            activeOpacity={1}
            onPressOut={closeStateModal}
          >
            <Animated.View
              style={[
                {
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: colors.card,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  maxHeight: "70%",
                  transform: [{ translateY: modalAnim }],
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  padding: 16,
                  color: isDarkMode ? "whitesmoke" : colors.text,
                }}
              >
                Select State
              </Text>

              {/* Search Bar */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 10,
                  marginHorizontal: 16,
                  marginBottom: 8,
                  paddingHorizontal: 8,
                  backgroundColor: colors.background,
                }}
              >
                <Icon
                  name="search-outline"
                  size={20}
                  color={colors.secondaryText}
                />
                <TextInput
                  style={{
                    flex: 1,
                    marginLeft: 8,
                    color: isDarkMode ? "whitesmoke" : colors.text,
                    height: 40,
                  }}
                  placeholder="Search state"
                  placeholderTextColor={colors.secondaryText}
                  value={stateSearch}
                  onChangeText={setStateSearch}
                />
              </View>

              <FlatList
                ref={stateListRef}
                data={filteredStates}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectState(item)}
                    style={{
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: isDarkMode ? "whitesmoke" : colors.text,
                        fontSize: 16,
                      }}
                    >
                      {item}
                    </Text>
                    {form.state === item && (
                      <Feather name="check" size={20} color={colors.accent} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </Animated.View>
          </TouchableOpacity>
        </Modal>

        <InputField
          icon="mail-outline"
          placeholder="Postal Code"
          value={form.postalCode}
          onChangeText={(val) =>
            handleChange("postalCode", val.replace(/[^0-9]/g, ""))
          }
          keyboardType="numeric"
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
              {
                color: form.country
                  ? isDarkMode
                    ? "whitesmoke"
                    : colors.text
                  : colors.secondaryText,
              },
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

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save Address</Text>
        </TouchableOpacity>
      </ScrollView>
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

export default AddAddressScreen;
