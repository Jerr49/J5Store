import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { CardInfo, Colors } from "../../../types/PaymentMethodTypes";

interface CardPaymentFormProps {
  cardInfo: CardInfo;
  cardErrors: {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
  };
  colors: Colors;
  onCardChange: (field: keyof CardInfo, value: string) => void;
}

const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  cardInfo,
  cardErrors,
  colors,
  onCardChange,
}) => {
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{1,4}/g);
    return matches ? matches.join(' ') : '';
  };

  const handleCardChange = (field: keyof CardInfo, value: string) => {
    let formattedValue = value;
    
    if (field === "number") {
      formattedValue = formatCardNumber(value);
    } else if (field === "expiry") {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 5);
    } else if (field === "cvv") {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    onCardChange(field, formattedValue);
  };

  const renderCardInput = (
    placeholder: string,
    value: string,
    field: keyof CardInfo,
    secure: boolean = false,
    keyboardType: "default" | "numeric" = "default",
    style: any = {}
  ) => (
    <View style={[styles.inputContainer, style]}>
      <Text style={[styles.inputLabel, { color: colors.text }]}>
        {placeholder}
        {field === "cvv" && (
          <Text style={[styles.helperText, { color: colors.subtext }]}>
            {" "}(3-4 digits)
          </Text>
        )}
      </Text>
      <View style={[
        styles.cardField, 
        { 
          borderColor: cardErrors[field] ? colors.error : colors.border,
          backgroundColor: colors.card,
        }
      ]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.subtext}
          value={value}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          style={[styles.input, { color: colors.text }]}
          onChangeText={(text) => handleCardChange(field, text)}
        />
        {field === "number" && value.replace(/\s/g, '').length === 16 && (
          <Feather name="check-circle" size={16} color={colors.success} />
        )}
      </View>
      {cardErrors[field] ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{cardErrors[field]}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.cardForm}>
      <Text style={[styles.paymentMethodLabel, { color: colors.text }]}>
        Credit/Debit Card
      </Text>
      {renderCardInput("Card Number", cardInfo.number, "number", false, "numeric")}
      {renderCardInput("Cardholder Name", cardInfo.name, "name")}
      <View style={styles.row}>
        {renderCardInput("Expiry Date", cardInfo.expiry, "expiry", false, "numeric", { flex: 1, marginRight: 8 })}
        {renderCardInput("CVV", cardInfo.cvv, "cvv", true, "numeric", { flex: 1 })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardForm: {
    marginTop: 8,
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
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
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
});

export default CardPaymentForm;