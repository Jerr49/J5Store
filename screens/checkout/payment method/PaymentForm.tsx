import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/index";
import {
  PaymentMethod,
  addMethod,
  setDefaultMethod,
  selectPaymentMethod,
  removeMethod,
} from "../../../store/slices/paymentSlice";
import Checkbox from "expo-checkbox";

// Import the new components
import PaymentMethodSelectorModal from "./PaymentMethodSelectorModal";
import SavedPaymentMethods from "./SavedPaymentMethods";
import CardPaymentForm from "./CardPaymentForm";
import DigitalPaymentForm from "./DigitalPaymentForm";
import { CardInfo, DigitalPaymentInfo, PaymentMethodType, Colors } from "../../../types/PaymentMethodTypes";

type Props = {
  colors: Colors;
  cardInfo: CardInfo;
  setCardInfo: React.Dispatch<React.SetStateAction<CardInfo>>;
  selectedPayment: PaymentMethodType;
  setSelectedPayment: React.Dispatch<React.SetStateAction<PaymentMethodType>>;
  setActiveSection: React.Dispatch<
    React.SetStateAction<"shipping" | "payment" | "review">
  >;
  onBack?: () => void;
  onNext?: () => void;
};

const PaymentForm: React.FC<Props> = ({
  colors,
  cardInfo,
  setCardInfo,
  selectedPayment,
  setSelectedPayment,
  setActiveSection,
  onBack,
  onNext,
}) => {
  const dispatch = useDispatch();
  const { methods } = useSelector((state: RootState) => state.payment);
  const defaultMethod = methods.find((m) => m.isDefault);

  const [useDefault, setUseDefault] = useState(!!defaultMethod);
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [digitalPaymentInfo, setDigitalPaymentInfo] = useState<DigitalPaymentInfo>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMethodSelector, setShowMethodSelector] = useState(false);
  const [cardErrors, setCardErrors] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [digitalErrors, setDigitalErrors] = useState("");

  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Validation functions
  const validateCard = () => {
    const errors = {
      number: cardInfo.number.replace(/\s/g, '').length !== 16 ? "Card number must be 16 digits" : "",
      name: cardInfo.name.length < 2 ? "Enter valid name" : "",
      expiry: !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardInfo.expiry) ? "MM/YY format required" : "",
      cvv: !/^\d{3,4}$/.test(cardInfo.cvv) ? "Invalid CVV" : "",
    };
    setCardErrors(errors);
    return !Object.values(errors).some(error => error !== "");
  };

  const validateDigitalPayment = () => {
    let error = "";
    
    switch (selectedPayment) {
      case "paypal":
        if (!digitalPaymentInfo.email || !/\S+@\S+\.\S+/.test(digitalPaymentInfo.email)) {
          error = "Please enter a valid PayPal email";
        }
        break;
      case "applepay":
        if (!digitalPaymentInfo.appleId || digitalPaymentInfo.appleId.length < 3) {
          error = "Please enter a valid Apple ID";
        }
        break;
      case "cashapp":
        if (!digitalPaymentInfo.cashappTag && !digitalPaymentInfo.phone) {
          error = "Please enter your CashApp tag or phone number";
        } else if (digitalPaymentInfo.cashappTag && !/^[a-zA-Z0-9_]+$/.test(digitalPaymentInfo.cashappTag)) {
          error = "Please enter a valid CashApp tag";
        }
        break;
    }
    
    setDigitalErrors(error);
    return !error;
  };

  // Event handlers
  const handleCardChange = (field: keyof CardInfo, value: string) => {
    setCardInfo({ ...cardInfo, [field]: value });
    if (cardErrors[field]) {
      setCardErrors({ ...cardErrors, [field]: "" });
    }
  };

  const handleDigitalPaymentChange = (field: keyof DigitalPaymentInfo, value: string) => {
    setDigitalPaymentInfo({ ...digitalPaymentInfo, [field]: value });
    if (digitalErrors) setDigitalErrors("");
  };

  const handleSelectMethod = (method: PaymentMethod) => {
    setUseDefault(false);
    setSelectedPayment(method.type as PaymentMethodType);
    dispatch(selectPaymentMethod(method.id));
    setDigitalPaymentInfo({});
    setDigitalErrors("");
  };

  const handleAddNewPayment = (type: PaymentMethodType) => {
    setUseDefault(false);
    setSelectedPayment(type);
    setShowMethodSelector(false);
    setCardInfo({ number: "", name: "", expiry: "", cvv: "" });
    setDigitalPaymentInfo({});
    setCardErrors({ number: "", name: "", expiry: "", cvv: "" });
    setDigitalErrors("");
    setSaveAsDefault(false);
  };

  const handleRemoveMethod = (methodId: string) => {
    if (methods.length <= 1) {
      Alert.alert(
        "Cannot Remove",
        "You need to have at least one payment method saved.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    Alert.alert(
      "Remove Payment Method",
      "Are you sure you want to remove this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            dispatch(removeMethod(methodId));
            if (methodId === defaultMethod?.id) {
              const remainingMethods = methods.filter(m => m.id !== methodId);
              if (remainingMethods.length > 0) {
                dispatch(setDefaultMethod(remainingMethods[0].id));
              }
            }
          }
        },
      ]
    );
  };

  const handleSetDefault = (methodId: string) => {
    dispatch(setDefaultMethod(methodId));
    setUseDefault(true);
  };

  const handleContinue = async () => {
    if (useDefault && defaultMethod) {
      if (onNext) onNext();
      else setActiveSection("review");
      return;
    }

    setIsProcessing(true);

    try {
      let isValid = selectedPayment === "card" ? validateCard() : validateDigitalPayment();

      if (!isValid) {
        Alert.alert("Validation Error", "Please fix the errors before continuing.");
        setIsProcessing(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      if (saveAsDefault) {
        const id = Date.now().toString();
        let newMethod: PaymentMethod;

        if (selectedPayment === "card") {
          newMethod = {
            id,
            type: "card",
            name: cardInfo.name,
            number: cardInfo.number.replace(/\s/g, ''),
            expiry: cardInfo.expiry,
            cvv: cardInfo.cvv,
            isDefault: true,
          };
        } else {
          newMethod = {
            id,
            type: selectedPayment,
            name: selectedPayment === "paypal" ? digitalPaymentInfo.email || "" :
                  selectedPayment === "applepay" ? digitalPaymentInfo.appleId || "" :
                  digitalPaymentInfo.cashappTag || digitalPaymentInfo.phone || "",
            isDefault: true,
          };
        }

        dispatch(addMethod(newMethod));
        dispatch(setDefaultMethod(id));
      }

      if (onNext) onNext();
      else setActiveSection("review");
    } catch (error) {
      Alert.alert("Error", "There was an issue processing your payment method.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Animated.View 
        style={[
          styles.container, 
          { transform: [{ translateX: slideAnim }] }
        ]}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
          
          {/* Quick Action Header */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.quickAction, { backgroundColor: colors.card }]}
              onPress={() => setUseDefault(!!defaultMethod)}
            >
              <Feather name="credit-card" size={16} color={colors.text} />
              <Text style={[styles.quickActionText, { color: colors.text }]}>
                Use Saved Card
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickAction, { backgroundColor: colors.card }]}
              onPress={() => setShowMethodSelector(true)}
            >
              <Feather name="plus" size={16} color={colors.accent} />
              <Text style={[styles.quickActionText, { color: colors.accent }]}>
                Add New Method
              </Text>
            </TouchableOpacity>
          </View>

          {/* Saved Payment Methods */}
          <SavedPaymentMethods
            methods={methods}
            defaultMethod={defaultMethod}
            useDefault={useDefault}
            selectedPayment={selectedPayment}
            colors={colors}
            onToggleUseDefault={setUseDefault}
            onSelectMethod={handleSelectMethod}
            onSetDefault={handleSetDefault}
            onRemoveMethod={handleRemoveMethod}
          />

          {/* New Payment Method Form */}
          {!useDefault && (
            <View style={styles.newMethodSection}>
              <Text style={[styles.subsectionTitle, { color: colors.text }]}>
                {selectedPayment === "card" ? "Enter Card Details" : `Setup Payment Details`}
              </Text>

              {/* Card Input Form */}
              {selectedPayment === "card" && (
                <CardPaymentForm
                  cardInfo={cardInfo}
                  cardErrors={cardErrors}
                  colors={colors}
                  onCardChange={handleCardChange}
                />
              )}

              {/* Digital Payment Input Forms */}
              {(selectedPayment === "paypal" || selectedPayment === "applepay" || selectedPayment === "cashapp") && (
                <DigitalPaymentForm
                  selectedPayment={selectedPayment}
                  digitalPaymentInfo={digitalPaymentInfo}
                  digitalErrors={digitalErrors}
                  colors={colors}
                  onDigitalPaymentChange={handleDigitalPaymentChange}
                />
              )}

              {/* Save as default option */}
              <View style={styles.saveDefaultRow}>
                <Checkbox
                  value={saveAsDefault}
                  onValueChange={setSaveAsDefault}
                  color={saveAsDefault ? colors.accent : undefined}
                />
                <View style={styles.saveDefaultTextContainer}>
                  <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                    Save as default payment method
                  </Text>
                  <Text style={[styles.checkboxDescription, { color: colors.subtext }]}>
                    This will be your preferred payment method for future purchases
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Security Notice */}
          <View style={[styles.securitySection, { backgroundColor: `${colors.success}15` }]}>
            <Feather name="lock" size={16} color={colors.success} />
            <View style={styles.securityTextContainer}>
              <Text style={[styles.securityTitle, { color: colors.text }]}>
                Secure Payment
              </Text>
              <Text style={[styles.securityText, { color: colors.subtext }]}>
                Your payment information is encrypted and secure. We never store your full card details.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          {onBack ? (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.backButton, { backgroundColor: colors.border }]} 
                onPress={onBack}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Back to Shipping</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.button, 
                  styles.continueButton, 
                  { 
                    backgroundColor: isProcessing ? colors.subtext : colors.accent,
                    opacity: isProcessing ? 0.7 : 1,
                    flex: 2, // Give continue button more space
                  }
                ]} 
                onPress={handleContinue}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Feather name="loader" size={16} color={colors.buttonText} />
                    <Text style={[styles.buttonText, { color: colors.buttonText, marginLeft: 8 }]}>
                      Processing...
                    </Text>
                  </>
                ) : (
                  <>
                    <Feather name="lock" size={16} color={colors.buttonText} />
                    <Text style={[styles.buttonText, { color: colors.buttonText, marginLeft: 8 }]}>
                      Continue to Review
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            // When there's no back button, make continue button full width
            <TouchableOpacity 
              style={[
                styles.fullWidthButton, 
                { 
                  backgroundColor: isProcessing ? colors.subtext : colors.accent,
                  opacity: isProcessing ? 0.7 : 1,
                }
              ]} 
              onPress={handleContinue}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Feather name="loader" size={16} color={colors.buttonText} />
                  <Text style={[styles.buttonText, { color: colors.buttonText, marginLeft: 8 }]}>
                    Processing...
                  </Text>
                </>
              ) : (
                <>
                  <Feather name="lock" size={16} color={colors.buttonText} />
                  <Text style={[styles.buttonText, { color: colors.buttonText, marginLeft: 8 }]}>
                    Continue to Review
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        <PaymentMethodSelectorModal
          visible={showMethodSelector}
          onClose={() => setShowMethodSelector(false)}
          onSelectMethod={handleAddNewPayment}
          colors={colors}
        />
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 140, 
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  quickAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  newMethodSection: {
    marginBottom: 24,
  },
  saveDefaultRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  saveDefaultTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  checkboxDescription: {
    fontSize: 12,
  },
  securitySection: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  securityTextContainer: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  securityText: {
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    minHeight: 90, 
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    minHeight: 54, 
  },
  fullWidthButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18, 
    borderRadius: 12,
    width: '100%',
    minHeight: 56, 
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    flex: 1.7, 
  },
  continueButton: {
    backgroundColor: '#007AFF',
    flex: 2, 
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PaymentForm;