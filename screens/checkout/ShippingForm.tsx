import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/index";
import { addAddress, selectAddress } from "../../store/slices/shippingSlice";
import Checkbox from "expo-checkbox";
import { Feather } from "@expo/vector-icons";

type ShippingInfo = {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
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
    error: string;
    success: string;
  };
  shippingInfo: ShippingInfo;
  setShippingInfo: React.Dispatch<React.SetStateAction<ShippingInfo>>;
  onNext: () => void;
};

const ShippingForm: React.FC<Props> = ({
  colors,
  shippingInfo,
  setShippingInfo,
  onNext,
}) => {
  const dispatch = useDispatch();
  const { addresses } = useSelector((state: RootState) => state.shipping);

  const [saveAddress, setSaveAddress] = useState(false);
  const [useDefault, setUseDefault] = useState(true);
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const defaultAddress = addresses.find((a) => a.isDefault);

  const fieldCount = 7;
  const animValues = useRef(
    [...Array(fieldCount)].map(() => new Animated.Value(0))
  ).current;

  const buttonScale = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Animation for default address box
  const defaultBoxAnim = useRef(new Animated.Value(1)).current;

  // Form validation
  useEffect(() => {
    validateForm();
  }, [shippingInfo, useDefault]);

  const validateForm = () => {
    const newErrors: Partial<ShippingInfo> = {};

    if (!useDefault) {
      if (!shippingInfo.fullName?.trim()) newErrors.fullName = "Full name is required";
      if (!shippingInfo.address?.trim()) newErrors.address = "Address is required";
      if (!shippingInfo.city?.trim()) newErrors.city = "City is required";
      if (!shippingInfo.state?.trim()) newErrors.state = "State is required";
      if (!shippingInfo.postalCode?.trim()) newErrors.postalCode = "Postal code is required";
      if (!shippingInfo.country?.trim()) newErrors.country = "Country is required";
      
      if (!shippingInfo.phone?.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(shippingInfo.phone.replace(/\s/g, ''))) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    setErrors(newErrors);
    setIsFormValid(useDefault || Object.keys(newErrors).length === 0);
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    if (useDefault && defaultAddress) {
      // Animate fields out
      Animated.stagger(
        50,
        animValues
          .map((val) =>
            Animated.timing(val, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            })
          )
          .reverse()
      ).start(() => {
        // Animate default box in
        Animated.timing(defaultBoxAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });

      // Fill default address
      setShippingInfo({
        fullName: defaultAddress.fullName,
        address: defaultAddress.address,
        city: defaultAddress.city,
        state: defaultAddress.state,
        postalCode: defaultAddress.postalCode,
        country: defaultAddress.country,
        phone: defaultAddress.phone,
      });
      dispatch(selectAddress(defaultAddress.id));
      setErrors({});
    } else if (!useDefault) {
      // Animate default box out
      Animated.timing(defaultBoxAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        // Reset form for new input
        setShippingInfo({
          fullName: "",
          address: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          phone: "",
        });

        // Animate input fields in
        Animated.stagger(
          50,
          animValues.map((val) =>
            Animated.timing(val, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            })
          )
        ).start();
      });
    }
  }, [useDefault]);

  const handleChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContinue = () => {
    if (!isFormValid) {
      triggerShake();
      Alert.alert("Validation Error", "Please fix the errors before continuing.");
      return;
    }

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (!useDefault && saveAddress) {
      const id = Date.now().toString();
      dispatch(addAddress({ 
        id, 
        ...shippingInfo,
        isDefault: addresses.length === 0 // Set as default if no addresses exist
      }));
    }
    
    onNext();
  };

  const renderInput = (
    icon: React.ComponentProps<typeof Feather>["name"],
    placeholder: string,
    value: string,
    field: keyof ShippingInfo,
    index: number,
    keyboardType: "default" | "numeric" = "default",
    maxLength?: number
  ) => (
    <Animated.View
      key={field}
      style={{
        opacity: animValues[index],
        transform: [
          {
            translateY: animValues[index].interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
        marginBottom: 8,
      }}
    >
      <View style={[
        styles.inputContainer, 
        { 
          borderColor: errors[field] ? colors.error : colors.border,
          backgroundColor: colors.card,
        }
      ]}>
        <Feather
          name={icon}
          size={20}
          color={errors[field] ? colors.error : colors.accent}
          style={{ marginRight: 10 }}
        />
        <TextInput
          value={value}
          onChangeText={(text) => handleChange(field, text)}
          style={[
            styles.input,
            { 
              color: colors.text,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.subtext}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onBlur={validateForm}
        />
      </View>
      {errors[field] && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {errors[field]}
        </Text>
      )}
    </Animated.View>
  );

  const inputFields = [
    { icon: "user" as const, placeholder: "Full Name", field: "fullName" as const },
    { icon: "home" as const, placeholder: "Address", field: "address" as const },
    { icon: "map-pin" as const, placeholder: "City", field: "city" as const },
    { icon: "map" as const, placeholder: "State/Province", field: "state" as const },
    { icon: "key" as const, placeholder: "Postal Code", field: "postalCode" as const, keyboardType: "numeric" as const },
    { icon: "flag" as const, placeholder: "Country", field: "country" as const },
    { icon: "phone" as const, placeholder: "Phone Number", field: "phone" as const, keyboardType: "numeric" as const, maxLength: 15 },
  ];

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={{ flex: 1, padding: 20 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Shipping Information
        </Text>

        {defaultAddress && (
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={styles.row}
              onPress={() => setUseDefault(!useDefault)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.checkboxContainer,
                { borderColor: useDefault ? colors.accent : colors.border }
              ]}>
                {useDefault && (
                  <View style={[styles.checkboxInner, { backgroundColor: colors.accent }]} />
                )}
              </View>
              <Text style={[styles.optionLabel, { color: colors.text }]}>
                Use Default Address
              </Text>
            </TouchableOpacity>
            
            <Text style={[styles.optionDescription, { color: colors.subtext }]}>
              {defaultAddress.fullName}, {defaultAddress.city}
            </Text>
          </View>
        )}

        {defaultAddress && useDefault && (
          <Animated.View
            style={{
              opacity: defaultBoxAnim,
              transform: [
                {
                  translateY: defaultBoxAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            }}
          >
            <View style={[styles.defaultBox, { backgroundColor: colors.card }]}>
              <Feather name="check-circle" size={20} color={colors.success} style={styles.defaultIcon} />
              <View style={styles.defaultContent}>
                <Text style={[styles.defaultTitle, { color: colors.text }]}>
                  Default Address Selected
                </Text>
                <Text style={[styles.defaultText, { color: colors.subtext }]}>
                  {defaultAddress.fullName}
                  {"\n"}
                  {defaultAddress.address}, {defaultAddress.city}
                  {"\n"}
                  {defaultAddress.state}, {defaultAddress.postalCode}
                  {"\n"}
                  {defaultAddress.country} • {defaultAddress.phone}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {!useDefault && (
          <Animated.View
            style={{
              transform: [{ translateX: shakeAnim }],
            }}
          >
            <Text style={[styles.sectionSubtitle, { color: colors.subtext, marginBottom: 16 }]}>
              Enter new shipping address
            </Text>
            
            {inputFields.map((fieldConfig, index) =>
              renderInput(
                fieldConfig.icon,
                fieldConfig.placeholder,
                shippingInfo[fieldConfig.field],
                fieldConfig.field,
                index,
                fieldConfig.keyboardType,
                fieldConfig.maxLength
              )
            )}

            <View style={styles.saveAddressContainer}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => setSaveAddress(!saveAddress)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkboxContainer,
                  { borderColor: saveAddress ? colors.accent : colors.border }
                ]}>
                  {saveAddress && (
                    <View style={[styles.checkboxInner, { backgroundColor: colors.accent }]} />
                  )}
                </View>
                <Text style={[styles.saveAddressLabel, { color: colors.text }]}>
                  Save this address for future orders
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Continue Button */}
        <Animated.View
          style={{
            transform: [{ scale: buttonScale }],
            marginTop: 24,
          }}
        >
          <TouchableOpacity
            style={[
              styles.button, 
              { 
                backgroundColor: isFormValid ? colors.accent : colors.border,
                opacity: isFormValid ? 1 : 0.6,
              }
            ]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={!isFormValid}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              Continue to Payment
            </Text>
            <Feather name="arrow-right" size={20} color={colors.buttonText} style={styles.buttonIcon} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: { 
    fontSize: 24, 
    fontWeight: "700", 
    marginBottom: 8,
    marginTop: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  optionContainer: {
    marginBottom: 16,
  },
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  optionDescription: {
    fontSize: 14,
    marginTop: 4,
    marginLeft: 32,
  },
  defaultBox: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  defaultIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  defaultContent: {
    flex: 1,
  },
  defaultTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  defaultText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 2,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
    fontWeight: "500",
  },
  saveAddressContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  saveAddressLabel: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: { 
    fontSize: 16, 
    fontWeight: "700",
  },
  buttonIcon: {
    marginLeft: 8,
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});

export default ShippingForm;