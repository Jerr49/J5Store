import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addMethod, PaymentMethod } from "../../store/slices/paymentSlice";
import { v4 as uuidv4 } from "uuid";
import { useNavigation } from "@react-navigation/native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "../../constants/theme";
import { RootState } from "../../store";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

// ===== CARD GRADIENTS =====
const CARD_GRADIENTS: Record<string, [string, string]> = {
  visa: ["#1a237e", "#3949ab"],
  mastercard: ["#ff5f00", "#eb001b"],
  amex: ["#4dd0e1", "#006fcf"],
  discover: ["#ffb74d", "#ff6000"],
  unknown: ["#333333", "#555555"],
};

// ===== CARD ICONS =====
const getCardIcon = (type: string) => {
  switch (type) {
    case "visa":
      return <FontAwesome5 name="cc-visa" size={28} color="#fff" />;
    case "mastercard":
      return <FontAwesome5 name="cc-mastercard" size={28} color="#fff" />;
    case "amex":
      return <FontAwesome5 name="cc-amex" size={28} color="#fff" />;
    case "discover":
      return <FontAwesome5 name="cc-discover" size={28} color="#fff" />;
    default:
      return <FontAwesome5 name="credit-card" size={28} color="#fff" />;
  }
};

// ===== CARD PREVIEW COMPONENT =====
const CardPreview = ({
  number,
  name,
  expiry,
  cvv,
  type,
  focusedField,
}: {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  type: string;
  focusedField: string;
}) => {
  const maskNumber = (num: string) => {
    const cleaned = num.replace(/\D/g, "");
    const masked = cleaned.slice(0, -4).replace(/\d/g, "•") + cleaned.slice(-4);
    return masked.replace(/(\d{4})/g, "$1 ").trim();
  };

  return (
    <LinearGradient
      colors={CARD_GRADIENTS[type] || CARD_GRADIENTS.unknown}
      style={styles.cardPreview}
    >
      <View style={styles.cardTop}>
        <Text style={styles.cardLabel}>CARD</Text>
        {getCardIcon(type)}
      </View>
      <Text style={styles.cardNumber}>{maskNumber(number) || "•••• •••• •••• ••••"}</Text>
      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.cardLabel}>Cardholder</Text>
          <Text style={styles.cardValue}>{name || "FULL NAME"}</Text>
        </View>
        <View>
          <Text style={styles.cardLabel}>Expiry</Text>
          <Text style={styles.cardValue}>{expiry || "MM/YY"}</Text>
        </View>
      </View>
      {focusedField === "cvv" && (
        <View style={styles.cvvOverlay}>
          <Text style={styles.cardLabel}>CVV</Text>
          <Text style={styles.cardValue}>{cvv || "•••"}</Text>
        </View>
      )}
    </LinearGradient>
  );
};

// ===== CREDIT CARD INPUT =====
const CreditCardInput = ({
  onChange,
  focusedField,
  setFocusedField,
}: {
  onChange: (data: any) => void;
  focusedField: string;
  setFocusedField: (field: string) => void;
}) => {
  const { colors } = useTheme();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState("unknown");

  const formatCardNumber = (text: string) =>
    text.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 2) return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    return cleaned;
  };

  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6(?:011|5)/.test(cleaned)) return "discover";
    return "unknown";
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
    const type = detectCardType(formatted);
    setCardType(type);
    const valid = formatted.replace(/\D/g, "").length === 16;
    onChange({
      valid: valid && expiry.replace(/\D/g, "").length === 4 && cvv.length === 3,
      values: { number: formatted, expiry, cvv, type },
    });
  };

  const handleExpiryChange = (text: string) => {
    const formatted = formatExpiry(text);
    setExpiry(formatted);
    const valid = formatted.replace(/\D/g, "").length === 4;
    onChange({
      valid: cardNumber.replace(/\D/g, "").length === 16 && valid && cvv.length === 3,
      values: { number: cardNumber, expiry: formatted, cvv, type: cardType },
    });
  };

  const handleCvvChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 3);
    setCvv(cleaned);
    const valid = cleaned.length === 3;
    onChange({
      valid:
        cardNumber.replace(/\D/g, "").length === 16 &&
        expiry.replace(/\D/g, "").length === 4 &&
        valid,
      values: { number: cardNumber, expiry, cvv: cleaned, type: cardType },
    });
  };

  return (
    <View>
      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>Card Number</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={colors.secondaryText}
            value={cardNumber}
            onChangeText={handleCardNumberChange}
            keyboardType="numeric"
            maxLength={19}
            onFocus={() => setFocusedField("number")}
          />
          <View style={{ position: "absolute", right: 12, top: Platform.OS === "ios" ? 12 : 10 }}>
            {getCardIcon(cardType)}
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>Expiry</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="MM/YY"
            placeholderTextColor={colors.secondaryText}
            value={expiry}
            onChangeText={handleExpiryChange}
            keyboardType="numeric"
            maxLength={5}
            onFocus={() => setFocusedField("expiry")}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>CVV</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
            placeholder="123"
            placeholderTextColor={colors.secondaryText}
            value={cvv}
            onChangeText={handleCvvChange}
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry
            onFocus={() => setFocusedField("cvv")}
          />
        </View>
      </View>
    </View>
  );
};

// ===== ADD PAYMENT METHOD SCREEN =====
const AddPaymentMethodScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const methods = useSelector((state: RootState) => state.payment.methods);

  const [cardData, setCardData] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", email: "", account: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod["type"]>("card");

  const validateInput = () => {
    if (selectedMethod === "card") {
      if (!cardData || !cardData.valid) {
        Alert.alert("Invalid Card", "Please check your card details.");
        return false;
      }
      if (!formData.name.trim()) {
        Alert.alert("Missing Information", "Please enter cardholder name.");
        return false;
      }
    } else {
      if (!formData.email.trim()) {
        Alert.alert("Missing Information", `Please enter your ${selectedMethod.toUpperCase()} email/account.`);
        return false;
      }
    }
    return true;
  };

  const handleAddMethod = async () => {
    if (!validateInput()) return;
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newMethod: PaymentMethod = {
        id: uuidv4(),
        name: selectedMethod === "card" ? formData.name : formData.email,
        number: selectedMethod === "card" ? cardData.values.number.replace(/\s/g, "").slice(-4) : undefined,
        type: selectedMethod,
        brand: selectedMethod === "card" ? cardData.values.type : selectedMethod,
        isDefault: methods.length === 0,
      };
      dispatch(addMethod(newMethod));
      Alert.alert("Success", "Payment method added!");
      navigation.goBack();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* <StatusBar barStyle="dark-content" backgroundColor={colors.background} /> */}
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={[styles.title, { color: colors.text }]}>Add Payment Method</Text>

        {/* ===== Payment Type Selector ===== */}
        <View style={{ flexDirection: "row", marginBottom: 20, justifyContent: "space-around" }}>
          {["card", "paypal", "applepay", "cashapp"].map((method) => (
            <TouchableOpacity
              key={method}
              style={{
                padding: 12,
                borderRadius: 10,
                borderWidth: selectedMethod === method ? 2 : 1,
                borderColor: selectedMethod === method ? colors.accent : colors.border,
              }}
              onPress={() => setSelectedMethod(method as PaymentMethod["type"])}
            >
              <Text style={{ color: colors.text, fontWeight: "600" }}>{method.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ===== Conditional Inputs ===== */}
        {selectedMethod === "card" ? (
          <>
            <CardPreview
              number={cardData?.values?.number || ""}
              name={formData.name}
              expiry={cardData?.values?.expiry || ""}
              cvv={cardData?.values?.cvv || ""}
              type={cardData?.values?.type || "unknown"}
              focusedField={focusedField}
            />

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Cardholder Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                placeholder="John Doe"
                placeholderTextColor={colors.secondaryText}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                onFocus={() => setFocusedField("name")}
              />
            </View>

            <CreditCardInput onChange={setCardData} focusedField={focusedField} setFocusedField={setFocusedField} />
          </>
        ) : (
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              {selectedMethod.toUpperCase()} Email / Account
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder={`Enter ${selectedMethod} email/account`}
              placeholderTextColor={colors.secondaryText}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              onFocus={() => setFocusedField("email")}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.accent }]}
          onPress={handleAddMethod}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather name="check" size={20} color="#fff" />
              <Text style={styles.addText}>Add Payment Method</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16 },
  cardPreview: { borderRadius: 16, padding: 20, marginBottom: 30, borderWidth: 1 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  cardLabel: { fontSize: 12, color: "#fff", fontWeight: "600" },
  cardNumber: { fontSize: 20, color: "#fff", fontWeight: "700", letterSpacing: 2, marginBottom: 20 },
  cardBottom: { flexDirection: "row", justifyContent: "space-between" },
  cardValue: { fontSize: 16, color: "#fff", fontWeight: "600" },
  cvvOverlay: { position: "absolute", top: 40, right: 20, alignItems: "center" },
  addButton: { flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 16, borderRadius: 12, marginTop: 10 },
  addText: { color: "#fff", fontWeight: "700", marginLeft: 8, fontSize: 16 },
});

export default AddPaymentMethodScreen;
