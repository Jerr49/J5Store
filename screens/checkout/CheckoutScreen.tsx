import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { clearCart } from "../../store/slices/cartSlice";
import { Feather, Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../components/navigation/TabNavigator";
import { StackNavigationProp } from "@react-navigation/stack";

// Card logos
const cardLogos: Record<string, string> = {
  visa: "https://img.icons8.com/color/48/000000/visa.png",
  mastercard: "https://img.icons8.com/color/48/000000/mastercard-logo.png",
  amex: "https://img.icons8.com/color/48/000000/american-express.png",
  discover: "https://img.icons8.com/color/48/000000/discover.png",
  default: "https://img.icons8.com/color/48/000000/bank-card-back-side.png",
};

// Card type detection
const getCardType = (num: string) => {
  const cleaned = num.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return "visa";
  if (/^5[1-5]/.test(cleaned)) return "mastercard";
  if (/^3[47]/.test(cleaned)) return "amex";
  if (/^6(?:011|5)/.test(cleaned)) return "discover";
  return "default";
};

// Route typing
type CheckoutScreenRouteProp = RouteProp<HomeStackParamList, "Checkout">;
type CheckoutScreenNavigationProp = StackNavigationProp<HomeStackParamList, "Checkout">;

const { width } = Dimensions.get('window');

const CheckoutScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const route = useRoute<CheckoutScreenRouteProp>();
  const product = route.params?.product;

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartTotal = useSelector((state: RootState) => state.cart.total);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  // Form states
  const [selectedPayment, setSelectedPayment] = useState<"card" | "paypal" | "applepay">("card");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
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
  const [activeSection, setActiveSection] = useState<"shipping" | "payment" | "review">("shipping");

  // Animations
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
    error: "#ef4444",
    border: isDarkMode ? "#374151" : "#e5e7eb",
    buttonText: "#fff",
  };

  // Format card number with spaces
  const formatCardNumber = (num: string) => {
    const cleaned = num.replace(/\D/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : "";
  };

  const formatExpiry = (val: string) => {
    const cleaned = val.replace(/\D/g, "");
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const cardType = getCardType(cardInfo.number);

  // Order calculation
  const itemPrice = product ? product.price : cartTotal;
  const shippingCost = itemPrice > 50 ? 0 : 5.99;
  const tax = itemPrice * 0.08;
  const total = itemPrice + shippingCost + tax;

  const handleInputChange = (field: keyof typeof shippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleCardInputChange = (field: keyof typeof cardInfo, value: string) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value).slice(0, 19);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value).slice(0, 5);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardInfo(prev => ({ ...prev, [field]: formattedValue }));
  };

  const validateForm = () => {
    // Validate shipping info
    if (!shippingInfo.fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return false;
    }
    if (!shippingInfo.address.trim()) {
      Alert.alert("Error", "Please enter your shipping address");
      return false;
    }
    if (!shippingInfo.city.trim()) {
      Alert.alert("Error", "Please enter your city");
      return false;
    }
    if (!shippingInfo.zipCode.trim() || shippingInfo.zipCode.length < 5) {
      Alert.alert("Error", "Please enter a valid ZIP code");
      return false;
    }

    // Validate payment info if paying by card
    if (selectedPayment === "card") {
      const cleanedCardNumber = cardInfo.number.replace(/\s/g, '');
      if (cleanedCardNumber.length < 13) {
        Alert.alert("Error", "Please enter a valid card number");
        return false;
      }
      if (!cardInfo.name.trim()) {
        Alert.alert("Error", "Please enter the cardholder name");
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardInfo.expiry)) {
        Alert.alert("Error", "Please enter a valid expiry date (MM/YY)");
        return false;
      }
      if (cardInfo.cvv.length < 3) {
        Alert.alert("Error", "Please enter a valid CVV");
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      const newOrderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(newOrderNumber);
      
      if (!product) dispatch(clearCart());
      setShowSuccessModal(true);
      setIsProcessing(false);
    }, 2000);
  };

  const renderProgressSteps = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressStep}>
        <View style={[styles.progressCircle, activeSection === "shipping" && { backgroundColor: colors.accent }]}>
          <Feather 
            name="truck" 
            size={16} 
            color={activeSection === "shipping" ? "#fff" : colors.subtext} 
          />
        </View>
        <Text style={[styles.progressLabel, { color: colors.text }]}>Shipping</Text>
      </View>
      
      <View style={[styles.progressLine, { backgroundColor: activeSection !== "shipping" ? colors.accent : colors.border }]} />
      
      <View style={styles.progressStep}>
        <View style={[styles.progressCircle, activeSection !== "shipping" && { backgroundColor: colors.accent }]}>
          <Feather 
            name="credit-card" 
            size={16} 
            color={activeSection !== "shipping" ? "#fff" : colors.subtext} 
          />
        </View>
        <Text style={[styles.progressLabel, { color: colors.text }]}>Payment</Text>
      </View>
      
      <View style={[styles.progressLine, { backgroundColor: activeSection === "review" ? colors.accent : colors.border }]} />
      
      <View style={styles.progressStep}>
        <View style={[styles.progressCircle, activeSection === "review" && { backgroundColor: colors.accent }]}>
          <Feather 
            name="check" 
            size={16} 
            color={activeSection === "review" ? "#fff" : colors.subtext} 
          />
        </View>
        <Text style={[styles.progressLabel, { color: colors.text }]}>Review</Text>
      </View>
    </View>
  );

  const renderShippingSection = () => (
    <Animated.View style={[styles.sectionCard, { backgroundColor: colors.card, opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Feather name="truck" size={20} color={colors.accent} />
          <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 8 }]}>
            Shipping Information
          </Text>
        </View>
      </View>
      
      <View style={styles.formRow}>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Full Name"
          placeholderTextColor={colors.subtext}
          value={shippingInfo.fullName}
          onChangeText={(text) => handleInputChange('fullName', text)}
        />
      </View>
      
      <View style={styles.formRow}>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="Street Address"
          placeholderTextColor={colors.subtext}
          value={shippingInfo.address}
          onChangeText={(text) => handleInputChange('address', text)}
        />
      </View>
      
      <View style={styles.formRow}>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text, flex: 1, marginRight: 12 }]}
          placeholder="City"
          placeholderTextColor={colors.subtext}
          value={shippingInfo.city}
          onChangeText={(text) => handleInputChange('city', text)}
        />
        
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text, width: 80 }]}
          placeholder="State"
          placeholderTextColor={colors.subtext}
          value={shippingInfo.state}
          onChangeText={(text) => handleInputChange('state', text)}
          maxLength={2}
          autoCapitalize="characters"
        />
      </View>
      
      <View style={styles.formRow}>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text, flex: 1, marginRight: 12 }]}
          placeholder="ZIP Code"
          placeholderTextColor={colors.subtext}
          value={shippingInfo.zipCode}
          onChangeText={(text) => handleInputChange('zipCode', text)}
          keyboardType="numeric"
          maxLength={10}
        />
        
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text, flex: 2 }]}
          placeholder="Phone Number"
          placeholderTextColor={colors.subtext}
          value={shippingInfo.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
          keyboardType="phone-pad"
        />
      </View>
      
      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: colors.accent }]}
        onPress={() => setActiveSection("payment")}
      >
        <Text style={[styles.continueButtonText, { color: colors.buttonText }]}>
          Continue to Payment
        </Text>
        <Feather name="arrow-right" size={20} color={colors.buttonText} />
      </TouchableOpacity>
    </Animated.View>
  );

  const renderPaymentSection = () => (
    <Animated.View style={[styles.sectionCard, { backgroundColor: colors.card, opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Feather name="credit-card" size={20} color={colors.accent} />
          <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 8 }]}>
            Payment Method
          </Text>
        </View>
      </View>
      
      <View style={styles.paymentOptions}>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            { borderColor: selectedPayment === "card" ? colors.accent : colors.border }
          ]}
          onPress={() => setSelectedPayment("card")}
        >
          <View style={styles.paymentOptionContent}>
            <Image
              source={{ uri: cardLogos[cardType] }}
              style={styles.cardLogo}
              resizeMode="contain"
            />
            <Text style={[styles.paymentOptionText, { color: colors.text }]}>
              Credit/Debit Card
            </Text>
          </View>
          {selectedPayment === "card" && (
            <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.paymentOption,
            { borderColor: selectedPayment === "paypal" ? colors.accent : colors.border }
          ]}
          onPress={() => setSelectedPayment("paypal")}
        >
          <View style={styles.paymentOptionContent}>
            <FontAwesome name="paypal" size={24} color="#0070ba" />
            <Text style={[styles.paymentOptionText, { color: colors.text }]}>
              PayPal
            </Text>
          </View>
          {selectedPayment === "paypal" && (
            <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.paymentOption,
            { borderColor: selectedPayment === "applepay" ? colors.accent : colors.border }
          ]}
          onPress={() => setSelectedPayment("applepay")}
        >
          <View style={styles.paymentOptionContent}>
            <FontAwesome name="apple" size={24} color={colors.text} />
            <Text style={[styles.paymentOptionText, { color: colors.text }]}>
              Apple Pay
            </Text>
          </View>
          {selectedPayment === "applepay" && (
            <Ionicons name="checkmark-circle" size={24} color={colors.accent} />
          )}
        </TouchableOpacity>
      </View>
      
      {selectedPayment === "card" && (
        <View style={styles.cardForm}>
          <View style={styles.formRow}>
            <View style={[styles.inputContainer, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.cardInput, { color: colors.text }]}
                placeholder="Card Number"
                placeholderTextColor={colors.subtext}
                value={cardInfo.number}
                onChangeText={(text) => handleCardInputChange('number', text)}
                keyboardType="numeric"
              />
              {cardInfo.number && (
                <Image
                  source={{ uri: cardLogos[cardType] }}
                  style={styles.cardTypeIcon}
                  resizeMode="contain"
                />
              )}
            </View>
          </View>
          
          <View style={styles.formRow}>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="Cardholder Name"
              placeholderTextColor={colors.subtext}
              value={cardInfo.name}
              onChangeText={(text) => handleCardInputChange('name', text)}
              autoCapitalize="words"
            />
          </View>
          
          <View style={styles.formRow}>
            <TextInput
              style={[styles.inputHalf, { borderColor: colors.border, color: colors.text, marginRight: 12 }]}
              placeholder="MM/YY"
              placeholderTextColor={colors.subtext}
              value={cardInfo.expiry}
              onChangeText={(text) => handleCardInputChange('expiry', text)}
              keyboardType="numeric"
            />
            
            <TextInput
              style={[styles.inputHalf, { borderColor: colors.border, color: colors.text }]}
              placeholder="CVV"
              placeholderTextColor={colors.subtext}
              value={cardInfo.cvv}
              onChangeText={(text) => handleCardInputChange('cvv', text)}
              keyboardType="numeric"
              secureTextEntry
            />
          </View>
        </View>
      )}
      
      {selectedPayment === "paypal" && (
        <View style={styles.paymentDescription}>
          <Text style={[styles.descriptionText, { color: colors.subtext }]}>
            You will be redirected to PayPal to complete your payment securely.
          </Text>
        </View>
      )}
      
      {selectedPayment === "applepay" && (
        <View style={styles.paymentDescription}>
          <Text style={[styles.descriptionText, { color: colors.subtext }]}>
            Complete your payment using Apple Pay for a faster checkout experience.
          </Text>
        </View>
      )}
      
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.navBackButton, { borderColor: colors.border }]}
          onPress={() => setActiveSection("shipping")}
        >
          <Text style={[styles.navBackButtonText, { color: colors.text }]}>
            Back
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: colors.accent }]}
          onPress={() => setActiveSection("review")}
        >
          <Text style={[styles.continueButtonText, { color: colors.buttonText }]}>
            Review Order
          </Text>
          <Feather name="arrow-right" size={20} color={colors.buttonText} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderReviewSection = () => (
    <Animated.View style={[styles.sectionCard, { backgroundColor: colors.card, opacity: fadeAnim }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Feather name="check-circle" size={20} color={colors.accent} />
          <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 8 }]}>
            Order Summary
          </Text>
        </View>
      </View>
      
      {/* Shipping Info Review */}
      <View style={styles.reviewSection}>
        <View style={styles.reviewSectionHeader}>
          <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>
            Shipping Address
          </Text>
          <TouchableOpacity onPress={() => setActiveSection("shipping")}>
            <Text style={[styles.editText, { color: colors.accent }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.reviewText, { color: colors.text }]}>
          {shippingInfo.fullName}
        </Text>
        <Text style={[styles.reviewText, { color: colors.text }]}>
          {shippingInfo.address}
        </Text>
        <Text style={[styles.reviewText, { color: colors.text }]}>
          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
        </Text>
        <Text style={[styles.reviewText, { color: colors.text }]}>
          {shippingInfo.phone}
        </Text>
      </View>
      
      {/* Payment Method Review */}
      <View style={styles.reviewSection}>
        <View style={styles.reviewSectionHeader}>
          <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>
            Payment Method
          </Text>
          <TouchableOpacity onPress={() => setActiveSection("payment")}>
            <Text style={[styles.editText, { color: colors.accent }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
        {selectedPayment === "card" ? (
          <>
            <Text style={[styles.reviewText, { color: colors.text }]}>
              {cardInfo.name}
            </Text>
            <Text style={[styles.reviewText, { color: colors.text }]}>
              **** {cardInfo.number.slice(-4)}
            </Text>
            <Text style={[styles.reviewText, { color: colors.text }]}>
              Expires: {cardInfo.expiry}
            </Text>
          </>
        ) : selectedPayment === "paypal" ? (
          <Text style={[styles.reviewText, { color: colors.text }]}>
            PayPal
          </Text>
        ) : (
          <Text style={[styles.reviewText, { color: colors.text }]}>
            Apple Pay
          </Text>
        )}
      </View>
      
      {/* Order Items */}
      <View style={styles.reviewSection}>
        <Text style={[styles.reviewSectionTitle, { color: colors.text }]}>
          Order Items
        </Text>
        {product ? (
          <View style={styles.orderItem}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            <View style={styles.orderItemDetails}>
              <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
                {product.name}
              </Text>
              <Text style={[styles.productPrice, { color: colors.subtext }]}>
                ${product.price.toFixed(2)}
              </Text>
            </View>
          </View>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
              />
              <View style={styles.orderItemDetails}>
                <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.productPrice, { color: colors.subtext }]}>
                  ${item.price.toFixed(2)} × {item.quantity}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
      
      {/* Order Total */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.subtext }]}>
            Subtotal
          </Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>
            ${itemPrice.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.subtext }]}>
            Shipping
          </Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>
            {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
          </Text>
        </View>
        
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.subtext }]}>
            Tax
          </Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>
            ${tax.toFixed(2)}
          </Text>
        </View>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.totalRow}>
          <Text style={[styles.grandTotalLabel, { color: colors.text }]}>
            Total
          </Text>
          <Animated.Text style={[styles.grandTotalValue, { color: colors.accent }]}>
            ${total.toFixed(2)}
          </Animated.Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={[
          styles.placeOrderButton,
          { backgroundColor: colors.accent },
          isProcessing && { opacity: 0.7 }
        ]}
        onPress={handlePlaceOrder}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={[styles.placeOrderText, { color: colors.buttonText, marginLeft: 8 }]}>
              Processing...
            </Text>
          </View>
        ) : (
          <>
            <Feather name="credit-card" size={20} color={colors.buttonText} />
            <Text style={[styles.placeOrderText, { color: colors.buttonText }]}>
              Place Order
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
    // Use type-safe navigation
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback: navigate to the home screen if we can't go back
      navigation.navigate("HomeScreen" as never);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['right', 'left', 'top']}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
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
          
          {activeSection === "shipping" && renderShippingSection()}
          {activeSection === "payment" && renderPaymentSection()}
          {activeSection === "review" && renderReviewSection()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.successIcon}>
              <Feather name="check-circle" size={64} color={colors.success} />
            </View>
            <Text style={[styles.successTitle, { color: colors.text }]}>
              Order Confirmed!
            </Text>
            <Text style={[styles.successText, { color: colors.subtext }]}>
              Thank you for your purchase. Your order number is:
            </Text>
            <Text style={[styles.orderNumber, { color: colors.accent }]}>
              {orderNumber}
            </Text>
            <Text style={[styles.successText, { color: colors.subtext }]}>
              You will receive a confirmation email shortly.
            </Text>
            <TouchableOpacity
              style={[styles.continueShoppingButton, { backgroundColor: colors.accent }]}
              onPress={handleContinueShopping}
            >
              <Text style={[styles.continueShoppingText, { color: colors.buttonText }]}>
                Continue Shopping
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  headerBackButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  progressStep: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
  progressLine: {
    height: 2,
    width: 50,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  sectionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  cardInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  inputHalf: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  cardTypeIcon: {
    width: 40,
    height: 24,
  },
  paymentOptions: {
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  cardLogo: {
    width: 40,
    height: 24,
  },
  cardForm: {
    marginBottom: 20,
  },
  paymentDescription: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  navBackButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    flex: 1,
  },
  navBackButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 14,
    flex: 2,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  reviewSection: {
    marginBottom: 24,
  },
  reviewSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  editText: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewText: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  orderItemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
  },
  totalSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
    marginBottom: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  placeOrderButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 18,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  continueShoppingButton: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  continueShoppingText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CheckoutScreen;