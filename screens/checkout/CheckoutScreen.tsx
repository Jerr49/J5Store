import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { clearCart } from "../../store/slices/cartSlice";
import { Feather, Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../components/navigation/TabNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

import ShippingForm from "./ShippingForm";
import PaymentForm from "./payment method/PaymentForm";
import ReviewOrder from "./ReviewOrder";
import SuccessModal from "./SuccessModal";

type CheckoutScreenRouteProp = RouteProp<HomeStackParamList, "Checkout">;
type CheckoutScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "Checkout"
>;

const CheckoutScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const route = useRoute<CheckoutScreenRouteProp>();
  const product = route.params?.product;

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartTotal = useSelector((state: RootState) => state.cart.total);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  // Fix: Add 'cashapp' to the payment method types
  const [selectedPayment, setSelectedPayment] = useState<
    "card" | "paypal" | "applepay" | "cashapp"
  >("card");

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
  });

  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [activeSection, setActiveSection] = useState<
    "shipping" | "payment" | "review"
  >("shipping");

  const [animatedTotal] = useState(new Animated.Value(cartTotal));
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedTotal, {
      toValue: cartTotal,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.ease,
    }).start();
  }, [cartTotal]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const colors = {
    background: isDarkMode ? "#111827" : "#f9fafb",
    card: isDarkMode ? "#1f2937" : "#fff",
    text: isDarkMode ? "#f9fafb" : "#1f2937",
    subtext: isDarkMode ? "#9ca3af" : "#6b7280",
    accent: "#4f46e5",
    success: "#10b981",
    border: isDarkMode ? "#374151" : "#e5e7eb",
    buttonText: "#fff",
    error: "#ef4444", // Added missing error color
    warning: "#f59e0b", // Added missing warning color
  };

  const itemPrice = product ? product.price : cartTotal;
  const shippingCost = itemPrice > 50 ? 0 : 5.99;
  const tax = itemPrice * 0.08;
  const total = itemPrice + shippingCost + tax;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newOrderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(newOrderNumber);

      if (!product) dispatch(clearCart());
      setShowSuccessModal(true);
      setIsProcessing(false);
    }, 2000);
  };

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate("HomeScreen" as never);
  };

  const renderProgressSteps = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressStep}>
        <View
          style={[
            styles.progressCircle,
            activeSection === "shipping" && { backgroundColor: colors.accent },
          ]}
        >
          <Feather
            name="truck"
            size={16}
            color={activeSection === "shipping" ? "#fff" : colors.subtext}
          />
        </View>
        <Text style={[styles.progressLabel, { color: colors.text }]}>
          Shipping
        </Text>
      </View>

      <View
        style={[
          styles.progressLine,
          {
            backgroundColor:
              activeSection !== "shipping" ? colors.accent : colors.border,
          },
        ]}
      />

      <View style={styles.progressStep}>
        <View
          style={[
            styles.progressCircle,
            activeSection === "payment" && { backgroundColor: colors.accent },
          ]}
        >
          <Feather
            name="credit-card"
            size={16}
            color={activeSection === "payment" ? "#fff" : colors.subtext}
          />
        </View>
        <Text style={[styles.progressLabel, { color: colors.text }]}>
          Payment
        </Text>
      </View>

      <View
        style={[
          styles.progressLine,
          {
            backgroundColor:
              activeSection === "review" ? colors.accent : colors.border,
          },
        ]}
      />

      <View style={styles.progressStep}>
        <View
          style={[
            styles.progressCircle,
            activeSection === "review" && { backgroundColor: colors.accent },
          ]}
        >
          <Feather
            name="check"
            size={16}
            color={activeSection === "review" ? "#fff" : colors.subtext}
          />
        </View>
        <Text style={[styles.progressLabel, { color: colors.text }]}>
          Review
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Checkout
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {renderProgressSteps()}

          {activeSection === "shipping" && (
            <ShippingForm
              colors={colors}
              shippingInfo={shippingInfo}
              setShippingInfo={setShippingInfo}
              onNext={() => setActiveSection("payment")}
            />
          )}

          {activeSection === "payment" && (
            <PaymentForm
              colors={colors}
              cardInfo={cardInfo}
              setCardInfo={setCardInfo}
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
              setActiveSection={setActiveSection}
              onBack={() => setActiveSection("shipping")}
              onNext={() => setActiveSection("review")}
            />
          )}

          {activeSection === "review" && (
            <ReviewOrder
              colors={colors}
              product={product}
              cartItems={cartItems}
              shippingInfo={shippingInfo}
              cardInfo={cardInfo}
              selectedPayment={selectedPayment}
              itemPrice={itemPrice}
              shippingCost={shippingCost}
              tax={tax}
              total={total}
              isProcessing={isProcessing}
              onPlaceOrder={handlePlaceOrder}
              onBack={() => setActiveSection("payment")}
              setActiveSection={setActiveSection}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccessModal}
        colors={colors}
        orderNumber={orderNumber}
        onClose={handleContinueShopping}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { 
    flexGrow: 1,
    padding: 16, 
    paddingBottom: 32 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerBackButton: { 
    padding: 8,
    marginLeft: -8 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: "700" 
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  progressStep: { 
    alignItems: "center",
    flex: 1,
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: { 
    fontSize: 12, 
    fontWeight: "500",
    textAlign: "center",
  },
  progressLine: { 
    flex: 1, 
    height: 2, 
    marginHorizontal: 8,
    maxWidth: 40,
  },
});

export default CheckoutScreen;