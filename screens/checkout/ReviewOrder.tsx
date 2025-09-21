import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type ShippingInfo = {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
};

type CardInfo = {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
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
  product?: { id: string; name: string; price: number };
  cartItems: CartItem[];
  shippingInfo: ShippingInfo;
  cardInfo: CardInfo;
  selectedPayment: "card" | "paypal" | "applepay";
  itemPrice: number;
  shippingCost: number;
  tax: number;
  total: number;
  isProcessing: boolean;
  onPlaceOrder: () => void;
  setActiveSection: React.Dispatch<
    React.SetStateAction<"shipping" | "payment" | "review">
  >;
};

const ReviewOrder: React.FC<Props> = ({
  colors,
  product,
  cartItems,
  shippingInfo,
  cardInfo,
  selectedPayment,
  itemPrice,
  shippingCost,
  tax,
  total,
  isProcessing,
  onPlaceOrder,
  setActiveSection,
}) => {
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Review Your Order
      </Text>

      {/* Shipping Info */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={[styles.label, { color: colors.subtext }]}>
            Shipping Address
          </Text>
          <TouchableOpacity onPress={() => setActiveSection("shipping")}>
            <Feather name="edit" size={16} color={colors.accent} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.value, { color: colors.text }]}>
          {shippingInfo.fullName}
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state}{" "}
          {shippingInfo.zipCode}
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {shippingInfo.country}
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {shippingInfo.phone}
        </Text>
      </View>

      {/* Payment Info */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={[styles.label, { color: colors.subtext }]}>
            Payment Method
          </Text>
          <TouchableOpacity onPress={() => setActiveSection("payment")}>
            <Feather name="edit" size={16} color={colors.accent} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.value, { color: colors.text }]}>
          {selectedPayment === "card"
            ? `Card ending in ${cardInfo.number.slice(-4) || "****"}`
            : selectedPayment === "paypal"
            ? "PayPal"
            : "Apple Pay"}
        </Text>
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.subtext }]}>Items</Text>
        {product ? (
          <Text style={[styles.value, { color: colors.text }]}>
            {product.name} - ${product.price.toFixed(2)}
          </Text>
        ) : (
          cartItems.map((item) => (
            <Text
              key={item.id}
              style={[styles.value, { color: colors.text }]}
            >
              {item.name} x {item.quantity} = $
              {(item.price * item.quantity).toFixed(2)}
            </Text>
          ))
        )}
      </View>

      {/* Price Summary */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={{ color: colors.subtext }}>Items:</Text>
          <Text style={{ color: colors.text }}>${itemPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={{ color: colors.subtext }}>Shipping:</Text>
          <Text style={{ color: colors.text }}>${shippingCost.toFixed(2)}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={{ color: colors.subtext }}>Tax:</Text>
          <Text style={{ color: colors.text }}>${tax.toFixed(2)}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>
            Total:
          </Text>
          <Text style={[styles.totalValue, { color: colors.accent }]}>
            ${total.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={onPlaceOrder}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            Place Order
          </Text>
        )}
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
  section: {
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 14,
    marginBottom: 2,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ReviewOrder;
