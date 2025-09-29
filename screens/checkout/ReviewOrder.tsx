import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";

type ShippingInfo = {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
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
    success: string;
    error: string;
  };
  product?: { id: string; name: string; price: number };
  cartItems: CartItem[];
  shippingInfo: ShippingInfo;
  cardInfo: CardInfo;
  selectedPayment: "card" | "paypal" | "applepay" | "cashapp";
  itemPrice: number;
  shippingCost: number;
  tax: number;
  total: number;
  isProcessing: boolean;
  onPlaceOrder?: () => void;
  onBack?: () => void;
  setActiveSection: React.Dispatch<
    React.SetStateAction<"shipping" | "payment" | "review">
  >;
  useDefaultPayment?: boolean;
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
  onBack,
  setActiveSection,
  useDefaultPayment = false,
}) => {
  // Get saved payment methods from Redux store
  const { methods } = useSelector((state: RootState) => state.payment);
  
  // Find the default method
  const defaultMethod = methods.find(m => m.isDefault);

  // Auto-detect if we should use default payment when cardInfo is empty but default exists
  const shouldUseDefaultPayment = useDefaultPayment || 
    (selectedPayment === "card" && 
     !cardInfo.number && 
     !cardInfo.name && 
     defaultMethod?.type === "card");

  // Get the actual payment method being used (default or new)
  const getActualPaymentMethod = () => {
    if (shouldUseDefaultPayment && defaultMethod) {
      return defaultMethod;
    } else {
      return { 
        type: selectedPayment, 
        number: cardInfo.number, 
        name: cardInfo.name, 
        expiry: cardInfo.expiry 
      };
    }
  };

  const actualPayment = getActualPaymentMethod();

  // Helper function to detect card type from card number
  const getCardType = (cardNumber: string): string => {
    if (!cardNumber) return "generic";
    
    const cleanNumber = cardNumber.replace(/\s+/g, '').replace(/\D/g, '');
    
    // Visa
    if (/^4/.test(cleanNumber)) return "visa";
    // Mastercard
    if (/^5[1-5]/.test(cleanNumber)) return "mastercard";
    // American Express
    if (/^3[47]/.test(cleanNumber)) return "amex";
    // Discover
    if (/^6(?:011|5)/.test(cleanNumber)) return "discover";
    // Diners Club
    if (/^3(?:0[0-5]|[68])/.test(cleanNumber)) return "diners";
    // JCB
    if (/^35/.test(cleanNumber)) return "jcb";
    // UnionPay
    if (/^62/.test(cleanNumber)) return "unionpay";
    
    return "generic";
  };

  // Helper function to get payment method display text
  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "card":
        return "Credit/Debit Card";
      case "paypal":
        return "PayPal";
      case "applepay":
        return "Apple Pay";
      case "cashapp":
        return "Cash App";
      default:
        return "Credit/Debit Card";
    }
  };

  // Helper function to get proper payment icon component
  const renderPaymentIcon = () => {
    const cardType = actualPayment.type === "card" ? getCardType(actualPayment.number || "") : null;
    
    switch (actualPayment.type) {
      case "card":
        switch (cardType) {
          case "visa":
            return <FontAwesome5 name="cc-visa" size={24} color="#1A1F71" />;
          case "mastercard":
            return <FontAwesome5 name="cc-mastercard" size={24} color="#EB001B" />;
          case "amex":
            return <FontAwesome5 name="cc-amex" size={24} color="#2E77BC" />;
          case "discover":
            return <FontAwesome5 name="cc-discover" size={24} color="#FF6000" />;
          case "diners":
            return <FontAwesome5 name="cc-diners-club" size={24} color="#0079BE" />;
          case "jcb":
            return <FontAwesome5 name="cc-jcb" size={24} color="#0B4EA2" />;
          case "unionpay":
            return <MaterialCommunityIcons name="credit-card-chip" size={24} color="#0455A4" />;
          default:
            return <FontAwesome5 name="credit-card" size={24} color={colors.accent} />;
        }
      case "paypal":
        return <FontAwesome5 name="paypal" size={24} color="#0070BA" />;
      case "applepay":
        return <FontAwesome5 name="apple" size={24} color="#000000" />;
      case "cashapp":
        return <MaterialIcons name="payment" size={24} color="#00D632" />;
      default:
        return <FontAwesome5 name="credit-card" size={24} color={colors.accent} />;
    }
  };

  // Helper function to get the last 4 digits from card number
  const getLastFourDigits = (cardNumber: string) => {
    if (!cardNumber) return "";
    
    const cleanNumber = cardNumber.replace(/\s+/g, '').replace(/\D/g, '');
    return cleanNumber.slice(-4);
  };

  // Helper function to get payment details display
  const getPaymentDetails = () => {
    switch (actualPayment.type) {
      case "card":
        const lastFourDigits = getLastFourDigits(actualPayment.number || "");
        const cardType = getCardType(actualPayment.number || "");
        const cardTypeName = getCardTypeDisplayName(cardType);
        
        return lastFourDigits ? 
          `${cardTypeName} Ending ...${lastFourDigits}` : 
          "Credit/Debit Card";
      case "paypal":
        if (shouldUseDefaultPayment && actualPayment.name) {
          return `PayPal (${actualPayment.name})`;
        }
        return "PayPal account";
      case "applepay":
        if (shouldUseDefaultPayment && actualPayment.name) {
          return `Apple Pay (${actualPayment.name})`;
        }
        return "Apple Pay";
      case "cashapp":
        if (shouldUseDefaultPayment && actualPayment.name) {
          return `Cash App (${actualPayment.name})`;
        }
        return "Cash App payment";
      default:
        return "Payment method";
    }
  };

  // Get card type display name
  const getCardTypeDisplayName = (cardType: string): string => {
    switch (cardType) {
      case "visa":
        return "Visa";
      case "mastercard":
        return "Mastercard";
      case "amex":
        return "American Express";
      case "discover":
        return "Discover";
      case "diners":
        return "Diners Club";
      case "jcb":
        return "JCB";
      case "unionpay":
        return "UnionPay";
      default:
        return "Credit Card";
    }
  };

  // Helper to get cardholder name
  const getCardholderName = () => {
    if (actualPayment.type === "card") {
      return actualPayment.name || cardInfo.name || "";
    }
    return "";
  };

  // Helper to get expiry date
  const getExpiryDate = () => {
    if (actualPayment.type === "card") {
      return actualPayment.expiry || cardInfo.expiry || "";
    }
    return "";
  };

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
          {shippingInfo.postalCode}
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
        <View style={styles.paymentMethodRow}>
          <View style={styles.paymentIconContainer}>
            {renderPaymentIcon()}
          </View>
          <View style={styles.paymentTextContainer}>
            <Text style={[styles.paymentDetails, { color: colors.text }]}>
              {getPaymentDetails()}
            </Text>
            <Text style={[styles.paymentType, { color: colors.subtext }]}>
              {getPaymentMethodText(actualPayment.type)}
              {shouldUseDefaultPayment && " • Saved"}
            </Text>
          </View>
        </View>
        
        {/* Show cardholder name for card payments */}
        {actualPayment.type === "card" && getCardholderName() && (
          <Text style={[styles.cardholderName, { color: colors.subtext }]}>
            Cardholder: {getCardholderName()}
          </Text>
        )}
        
        {/* Show expiry date for card payments */}
        {actualPayment.type === "card" && getExpiryDate() && (
          <Text style={[styles.cardDetails, { color: colors.subtext }]}>
            Expires: {getExpiryDate()}
          </Text>
        )}
      </View>

      {/* Rest of your component remains the same */}
      {/* Order Items */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.subtext }]}>Items</Text>
        {product ? (
          <View style={styles.itemRow}>
            <Text style={[styles.value, { color: colors.text, flex: 1 }]}>
              {product.name}
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              ${product.price.toFixed(2)}
            </Text>
          </View>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={[styles.value, { color: colors.text, flex: 1 }]}>
                {item.name} x {item.quantity}
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
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
          <Text style={{ color: colors.text }}>
            {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={{ color: colors.subtext }}>Tax:</Text>
          <Text style={{ color: colors.text }}>${tax.toFixed(2)}</Text>
        </View>
        <View style={[styles.rowBetween, styles.totalRow]}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>
            Total:
          </Text>
          <Text style={[styles.totalLabel, { color: colors.text }]}>
            ${total.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {onBack && (
          <TouchableOpacity
            style={[styles.button, styles.backButton, { backgroundColor: colors.border }]}
            onPress={onBack}
            disabled={isProcessing}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button, 
            styles.placeOrderButton, 
            { 
              backgroundColor: isProcessing ? colors.subtext : colors.accent,
              opacity: isProcessing ? 0.7 : 1
            }
          ]}
          onPress={onPlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={colors.buttonText} size="small" />
          ) : (
            <>
              <Feather name="lock" size={16} color={colors.buttonText} />
              <Text style={[styles.buttonText, { color: colors.buttonText, marginLeft: 8 }]}>
                Place Order
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Security Notice */}
      <View style={[styles.securitySection, { backgroundColor: `${colors.success}15` }]}>
        <Feather name="shield" size={14} color={colors.success} />
        <Text style={[styles.securityText, { color: colors.subtext }]}>
          Your order is secure and encrypted
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 16,
  },
  section: { 
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  paymentMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: '#f8f9fa',
  },
  paymentTextContainer: {
    flex: 1,
  },
  paymentDetails: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  paymentType: {
    fontSize: 14,
  },
  cardholderName: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 52,
  },
  cardDetails: {
    fontSize: 12,
    marginLeft: 52,
  },
  label: { 
    fontSize: 14, 
    fontWeight: "600",
    marginBottom: 8,
  },
  value: { 
    fontSize: 14,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: { 
    fontSize: 16, 
    fontWeight: "700" 
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
  },
  backButton: {
    flex: 0.4,
  },
  placeOrderButton: {
    flex: 0.6,
  },
  buttonText: { 
    fontSize: 16, 
    fontWeight: "600" 
  },
  securitySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default ReviewOrder;