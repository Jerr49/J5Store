import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { PaymentMethod, PAYMENT_METHODS, PaymentMethodType, Colors } from "../../../types/PaymentMethodTypes";

interface SavedPaymentMethodsProps {
  methods: PaymentMethod[];
  defaultMethod?: PaymentMethod;
  useDefault: boolean;
  selectedPayment: PaymentMethodType;
  colors: Colors;
  onToggleUseDefault: (value: boolean) => void;
  onSelectMethod: (method: PaymentMethod) => void;
  onSetDefault: (methodId: string) => void;
  onRemoveMethod: (methodId: string) => void;
}

const SavedPaymentMethods: React.FC<SavedPaymentMethodsProps> = ({
  methods,
  defaultMethod,
  useDefault,
  selectedPayment,
  colors,
  onToggleUseDefault,
  onSelectMethod,
  onSetDefault,
  onRemoveMethod,
}) => {
  const getIcon = (type: PaymentMethodType, size: number = 20) => {
    const method = PAYMENT_METHODS[type];
    switch (type) {
      case "card":
        return <MaterialCommunityIcons name={method.icon as any} size={size} color={colors.text} />;
      case "paypal":
        return <FontAwesome name={method.icon as any} size={size} color={method.color} />;
      case "applepay":
        return <MaterialCommunityIcons name={method.icon as any} size={size} color={colors.text} />;
      case "cashapp":
        return <MaterialIcons name={method.icon as any} size={size} color={method.color} />;
      default:
        return <Feather name="credit-card" size={size} color={colors.text} />;
    }
  };

  if (methods.length === 0) return null;

  return (
    <View style={styles.savedMethodsSection}>
      <Text style={[styles.subsectionTitle, { color: colors.text }]}>
        Saved Payment Methods
      </Text>
      
      {defaultMethod && (
        <View style={styles.defaultMethodContainer}>
          <View style={styles.methodHeader}>
            <View style={styles.methodInfo}>
              <Checkbox
                value={useDefault}
                onValueChange={onToggleUseDefault}
                color={useDefault ? colors.accent : undefined}
              />
              <Text style={[styles.defaultLabel, { color: colors.text }]}>
                Use Default Method
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[
              styles.paymentOption,
              { 
                borderColor: useDefault ? colors.accent : colors.border,
                backgroundColor: useDefault ? `${colors.accent}15` : colors.card
              }
            ]}
            onPress={() => onSelectMethod(defaultMethod)}
          >
            {getIcon(defaultMethod.type as PaymentMethodType, 24)}
            <View style={styles.methodDetails}>
              <Text style={[styles.methodName, { color: colors.text }]}>
                {defaultMethod.type === "card" 
                  ? `•••• ${defaultMethod.number?.slice(-4) || ''}`
                  : defaultMethod.name}
              </Text>
              <Text style={[styles.methodType, { color: colors.subtext }]}>
                {PAYMENT_METHODS[defaultMethod.type as PaymentMethodType]?.label}
              </Text>
            </View>
            {useDefault && (
              <View style={[styles.defaultBadge, { backgroundColor: colors.accent }]}>
                <Feather name="check" size={12} color={colors.buttonText} />
                <Text style={[styles.defaultBadgeText, { color: colors.buttonText }]}>
                  Default
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {methods.filter(m => !m.isDefault).map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentOption,
            { 
              borderColor: selectedPayment === method.type && !useDefault ? colors.accent : colors.border,
              backgroundColor: colors.card
            }
          ]}
          onPress={() => onSelectMethod(method)}
        >
          {getIcon(method.type as PaymentMethodType, 24)}
          <View style={styles.methodDetails}>
            <Text style={[styles.methodName, { color: colors.text }]}>
              {method.type === "card" 
                ? `•••• ${method.number?.slice(-4) || ''}`
                : method.name}
            </Text>
            <Text style={[styles.methodType, { color: colors.subtext }]}>
              {PAYMENT_METHODS[method.type as PaymentMethodType]?.label}
            </Text>
          </View>
          <View style={styles.methodActions}>
            <TouchableOpacity 
              onPress={() => onSetDefault(method.id)}
              style={styles.actionButton}
            >
              <Feather 
                name="star" 
                size={16} 
                color={method.isDefault ? colors.accent : colors.subtext} 
                fill={method.isDefault ? colors.accent : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => onRemoveMethod(method.id)}
              style={styles.actionButton}
            >
              <Feather name="trash-2" size={16} color={colors.subtext} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  savedMethodsSection: {
    marginBottom: 32,
  },
  defaultMethodContainer: {
    marginBottom: 16,
  },
  methodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  methodInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  methodActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
  },
  defaultLabel: {
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
    marginBottom: 12,
  },
  methodDetails: {
    flex: 1,
    marginLeft: 12,
  },
  methodName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  methodType: {
    fontSize: 14,
  },
  defaultBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
});

export default SavedPaymentMethods;