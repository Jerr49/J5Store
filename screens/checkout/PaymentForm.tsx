import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type CardInfo = {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
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
  cardInfo: CardInfo;
  setCardInfo: React.Dispatch<React.SetStateAction<CardInfo>>;
  selectedPayment: "card" | "paypal" | "applepay";
  setSelectedPayment: React.Dispatch<
    React.SetStateAction<"card" | "paypal" | "applepay">
  >;
  setActiveSection: React.Dispatch<
    React.SetStateAction<"shipping" | "payment" | "review">
  >;
};

const PaymentForm: React.FC<Props> = ({
  colors,
  cardInfo,
  setCardInfo,
  selectedPayment,
  setSelectedPayment,
  setActiveSection,
}) => {
  const handleCardChange = (field: keyof CardInfo, value: string) => {
    setCardInfo({ ...cardInfo, [field]: value });
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Payment Method
      </Text>

      {/* Payment Options */}
      {["card", "paypal", "applepay"].map((method) => (
        <TouchableOpacity
          key={method}
          style={[
            styles.paymentOption,
            {
              borderColor:
                selectedPayment === method ? colors.accent : colors.border,
            },
          ]}
          onPress={() =>
            setSelectedPayment(method as "card" | "paypal" | "applepay")
          }
        >
          <Feather
            name={
              method === "card"
                ? "credit-card"
                : method === "paypal"
                ? "dollar-sign"
                : "smartphone"
            }
            size={18}
            color={colors.text}
          />
          <Text style={[styles.paymentText, { color: colors.text }]}>
            {method === "card"
              ? "Credit / Debit Card"
              : method === "paypal"
              ? "PayPal"
              : "Apple Pay"}
          </Text>
          {selectedPayment === method && (
            <Feather name="check-circle" size={18} color={colors.accent} />
          )}
        </TouchableOpacity>
      ))}

      {/* Card Form (only if card selected) */}
      {selectedPayment === "card" && (
        <View style={{ marginTop: 16 }}>
          <TextInput
            placeholder="Card Number"
            placeholderTextColor={colors.subtext}
            keyboardType="numeric"
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text },
            ]}
            value={cardInfo.number}
            onChangeText={(text) => handleCardChange("number", text)}
          />

          <TextInput
            placeholder="Cardholder Name"
            placeholderTextColor={colors.subtext}
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.text },
            ]}
            value={cardInfo.name}
            onChangeText={(text) => handleCardChange("name", text)}
          />

          <View style={styles.row}>
            <TextInput
              placeholder="MM/YY"
              placeholderTextColor={colors.subtext}
              style={[
                styles.input,
                styles.halfInput,
                { borderColor: colors.border, color: colors.text },
              ]}
              value={cardInfo.expiry}
              onChangeText={(text) => handleCardChange("expiry", text)}
            />
            <TextInput
              placeholder="CVV"
              placeholderTextColor={colors.subtext}
              secureTextEntry
              keyboardType="numeric"
              style={[
                styles.input,
                styles.halfInput,
                { borderColor: colors.border, color: colors.text },
              ]}
              value={cardInfo.cvv}
              onChangeText={(text) => handleCardChange("cvv", text)}
            />
          </View>
        </View>
      )}

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={() => setActiveSection("review")}
      >
        <Text style={[styles.buttonText, { color: colors.buttonText }]}>
          Continue to Review
        </Text>
      </TouchableOpacity>
    </View>
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
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  paymentText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PaymentForm;
