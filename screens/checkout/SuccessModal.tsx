import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  orderNumber?: string; // 👈 added this
  colors: {
    background: string;
    card: string;
    text: string;
    subtext: string;
    accent: string;
    border: string;
    buttonText: string;
  };
};

const SuccessModal: React.FC<Props> = ({ visible, onClose, orderNumber, colors }) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
          <Feather
            name="check-circle"
            size={64}
            color={colors.accent}
            style={styles.icon}
          />
          <Text style={[styles.title, { color: colors.text }]}>
            Order Placed!
          </Text>
          {orderNumber && (
            <Text style={[styles.message, { color: colors.accent }]}>
              Order #{orderNumber}
            </Text>
          )}
          <Text style={[styles.message, { color: colors.subtext }]}>
            Your order has been successfully placed.{"\n"}
            You’ll receive a confirmation email shortly.
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SuccessModal;
