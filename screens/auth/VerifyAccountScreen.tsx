import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../components/navigation/MainNavigator";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface RouteParams {
  email: string;
}

// Individual code input with neon glow and typing animation
const CodeInput = React.forwardRef(
  (
    { value, onChangeText, onKeyPress, isFocused }: any,
    ref: React.Ref<TextInput>
  ) => {
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }, []);

    const borderColor = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["#667eea", "#a78bfa"],
    });

    return (
      <Animated.View style={{ borderColor, ...styles.codeInputWrapper }}>
        <TextInput
          ref={ref}
          style={[styles.codeInput, isFocused && styles.codeInputFocused]}
          value={value}
          onChangeText={onChangeText}
          onKeyPress={onKeyPress}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
        />
        {isFocused && !value && (
          <Animated.View style={styles.cursor}>
            <Animated.View
              style={[styles.cursorInner, { opacity: glowAnim }]}
            />
          </Animated.View>
        )}
      </Animated.View>
    );
  }
);

const VerifyAccountScreen = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { email } = route.params as RouteParams;

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, "");
    const newCode = [...code];
    newCode[index] = numericText;
    setCode(newCode);

    if (numericText && index < 5) inputRefs.current[index + 1]?.focus();
    if (newCode.every((digit) => digit !== "") && index === 5) handleVerify();
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (isLoading) return;
    setIsLoading(true);

    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      const verificationCode = code.join("");
      console.log("Verify with code:", verificationCode);
      navigation.navigate("Welcome");
      setIsLoading(false);
    }, 1500);
  };

  const handleResendCode = () => {
    if (!canResend) return;
    setCountdown(60);
    setCanResend(false);
    console.log("Resend code to:", email);
  };

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={["#f3f4f6", "#e0e7ff"]} style={styles.background}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.content}>
            {/* Header */}
            <Animated.View
              style={[
                styles.header,
                { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] },
              ]}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.logoGradient}
              >
                <Feather name="shield" size={40} color="#fff" />
              </LinearGradient>
              <Text style={styles.title}>Verify Your Account</Text>
              <Text style={styles.subtitle}>
                We've sent a code to{"\n"}
                <Text style={styles.emailText}>{email}</Text>
              </Text>
            </Animated.View>

            {/* Code Inputs */}
            <Animated.View
              style={[
                styles.codeContainer,
                { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] },
              ]}
            >
              <View style={styles.codeInputsContainer}>
                {code.map((digit, index) => (
                  <CodeInput
                    key={index}
                    ref={(ref: TextInput | null) => {
                      inputRefs.current[index] = ref;
                    }}
                    value={digit}
                    onChangeText={(text: string) =>
                      handleCodeChange(text, index)
                    }
                    onKeyPress={(e: any) => handleKeyPress(e, index)}
                    isFocused={focusedIndex === index}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                  />
                ))}
              </View>
            </Animated.View>

            {/* Verify Button */}
            <Animated.View
              style={[
                styles.buttonContainer,
                { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] },
              ]}
            >
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  style={[
                    styles.verifyButton,
                    isLoading && styles.verifyButtonDisabled,
                  ]}
                  onPress={handleVerify}
                  disabled={isLoading || code.some((d) => d === "")}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={["#667eea", "#764ba2"]}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.verifyButtonText}>Verify Account</Text>
                    <Feather
                      name="arrow-right"
                      size={20}
                      color="#fff"
                      style={{ marginLeft: 6 }}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>

            {/* Resend Code */}
            <Animated.View
              style={[
                styles.resendContainer,
                { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] },
              ]}
            >
              <Text style={styles.resendText}>
                Didn't receive the code?{" "}
                {canResend ? (
                  <Text style={styles.resendLink} onPress={handleResendCode}>
                    Resend code
                  </Text>
                ) : (
                  <Text style={styles.resendCountdown}>
                    Resend in {countdown}s
                  </Text>
                )}
              </Text>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>

        {/* Floating Decorations */}
        <Animated.View
          style={[
            styles.decorationCircle1,
            { transform: [{ translateY: floatTranslate }] },
          ]}
        />
        <Animated.View
          style={[
            styles.decorationCircle2,
            { transform: [{ translateY: floatTranslate }] },
          ]}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  keyboardView: { flex: 1 },
  content: { flex: 1, padding: 20, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 40 },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    lineHeight: 20,
  },
  emailText: { fontWeight: "600", color: "#667eea" },
  codeContainer: { marginBottom: 30 },
  codeInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  codeInputWrapper: {
    width: 50,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  codeInput: {
    width: 46,
    height: 56,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  codeInputFocused: {
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  cursor: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cursorInner: {
    width: 2,
    height: "70%",
    backgroundColor: "#667eea",
    borderRadius: 2,
  },
  buttonContainer: { marginBottom: 20 },
  verifyButton: { borderRadius: 12, overflow: "hidden" },
  verifyButtonDisabled: { opacity: 0.7 },
  gradientButton: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  verifyButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  resendContainer: { alignItems: "center" },
  resendText: { color: "#6b7280", fontSize: 14 },
  resendLink: { color: "#667eea", fontWeight: "600" },
  resendCountdown: { color: "#9ca3af" },
  decorationCircle1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(102,126,234,0.1)",
    top: -60,
    left: -40,
  },
  decorationCircle2: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(118,75,162,0.1)",
    bottom: -50,
    right: -30,
  },
});

export default VerifyAccountScreen;
