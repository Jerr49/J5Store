import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { PAYMENT_METHODS, PaymentMethodType, DigitalPaymentInfo, Colors } from "../../../types/PaymentMethodTypes";

interface DigitalPaymentFormProps {
  selectedPayment: PaymentMethodType;
  digitalPaymentInfo: DigitalPaymentInfo;
  digitalErrors: string;
  colors: Colors;
  onDigitalPaymentChange: (field: keyof DigitalPaymentInfo, value: string) => void;
}

const DigitalPaymentForm: React.FC<DigitalPaymentFormProps> = ({
  selectedPayment,
  digitalPaymentInfo,
  digitalErrors,
  colors,
  onDigitalPaymentChange,
}) => {
  const method = PAYMENT_METHODS[selectedPayment];

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: colors.text }]}>
        {selectedPayment === "paypal" ? "PayPal Email" :
         selectedPayment === "applepay" ? "Apple ID" :
         "CashApp Tag or Phone Number"}
      </Text>
      
      <View style={[
        styles.cardField, 
        { 
          borderColor: digitalErrors ? colors.error : colors.border,
          backgroundColor: colors.card,
        }
      ]}>
        <TextInput
          placeholder={
            selectedPayment === "paypal" ? "your.email@example.com" :
            selectedPayment === "applepay" ? "your.apple.id@example.com" :
            "$yourcashtag or phone number"
          }
          placeholderTextColor={colors.subtext}
          value={
            selectedPayment === "paypal" ? digitalPaymentInfo.email || "" :
            selectedPayment === "applepay" ? digitalPaymentInfo.appleId || "" :
            digitalPaymentInfo.cashappTag || ""
          }
          keyboardType={
            selectedPayment === "paypal" ? "email-address" :
            selectedPayment === "cashapp" ? "default" : "default"
          }
          autoCapitalize="none"
          style={[styles.input, { color: colors.text }]}
          onChangeText={(text) => onDigitalPaymentChange(
            selectedPayment === "paypal" ? "email" :
            selectedPayment === "applepay" ? "appleId" : "cashappTag",
            text
          )}
        />
      </View>

      {selectedPayment === "cashapp" && (
        <>
          <Text style={[styles.helperText, { color: colors.subtext, marginTop: 4 }]}>
            Or use your phone number
          </Text>
          <View style={[styles.cardField, { backgroundColor: colors.card, marginTop: 8 }]}>
            <TextInput
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={colors.subtext}
              value={digitalPaymentInfo.phone || ""}
              keyboardType="phone-pad"
              style={[styles.input, { color: colors.text }]}
              onChangeText={(text) => onDigitalPaymentChange("phone", text)}
            />
          </View>
        </>
      )}

      {digitalErrors ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{digitalErrors}</Text>
      ) : null}

      <View style={styles.benefitsContainer}>
        <Text style={[styles.benefitsTitle, { color: colors.text }]}>
          Why use {method.label}?
        </Text>
        {selectedPayment === "paypal" && (
          <Text style={[styles.benefitsText, { color: colors.subtext }]}>
            • Faster checkout{"\n"}
            • Buyer protection{"\n"}
            • Secure payments
          </Text>
        )}
        {selectedPayment === "applepay" && (
          <Text style={[styles.benefitsText, { color: colors.subtext }]}>
            • Quick and secure{"\n"}
            • Face ID/Touch ID support{"\n"}
            • Privacy focused
          </Text>
        )}
        {selectedPayment === "cashapp" && (
          <Text style={[styles.benefitsText, { color: colors.subtext }]}>
            • Instant transfers{"\n"}
            • No fees{"\n"}
            • Easy to use
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    fontWeight: "400",
  },
  cardField: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
  benefitsContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  benefitsText: {
    fontSize: 12,
    lineHeight: 18,
  },
});

export default DigitalPaymentForm;