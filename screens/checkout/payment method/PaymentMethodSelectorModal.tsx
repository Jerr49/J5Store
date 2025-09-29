import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { PAYMENT_METHODS, PaymentMethodType, Colors } from "../../../types/PaymentMethodTypes";

interface PaymentMethodSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMethod: (type: PaymentMethodType) => void;
  colors: Colors;
}

const PaymentMethodSelectorModal: React.FC<PaymentMethodSelectorModalProps> = ({
  visible,
  onClose,
  onSelectMethod,
  colors,
}) => {
  const getIcon = (type: PaymentMethodType, size: number = 20) => {
    const method = PAYMENT_METHODS[type];
    switch (type) {
      case "card":
        return <MaterialCommunityIcons name={method.icon as any} size={size} color={method.color} />;
      case "paypal":
        return <FontAwesome name={method.icon as any} size={size} color={method.color} />;
      case "applepay":
        return <MaterialCommunityIcons name={method.icon as any} size={size} color={method.color} />;
      case "cashapp":
        return <MaterialIcons name={method.icon as any} size={size} color={method.color} />;
      default:
        return <Feather name="credit-card" size={size} color={method.color} />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Payment Method</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.modalSubtitle, { color: colors.subtext }]}>
            Choose how you'd like to pay
          </Text>

          {(Object.entries(PAYMENT_METHODS) as [PaymentMethodType, any][]).map(([type, config]) => (
            <TouchableOpacity 
              key={type}
              style={[styles.methodOption, { backgroundColor: colors.card }]}
              onPress={() => onSelectMethod(type)}
            >
              <View style={styles.methodOptionLeft}>
                <View style={[styles.methodIconContainer, { backgroundColor: `${config.color}15` }]}>
                  {getIcon(type, 24)}
                </View>
                <View style={styles.methodTextContainer}>
                  <Text style={[styles.methodOptionText, { color: colors.text }]}>
                    {config.label}
                  </Text>
                  <Text style={[styles.methodOptionDescription, { color: colors.subtext }]}>
                    {config.description}
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={colors.subtext} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  methodOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIconContainer: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodOptionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  methodOptionDescription: {
    fontSize: 12,
  },
});

export default PaymentMethodSelectorModal;