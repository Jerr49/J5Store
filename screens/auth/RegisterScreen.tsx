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
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../components/navigation/MainNavigator";
import { LinearGradient } from "expo-linear-gradient";
import { Feather, FontAwesome5, Ionicons, AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(40)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current; // Logo animation

  useEffect(() => {
    // Form fade-in + slide-up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      // Logo bounce-in
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating icons
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });

  const handleRegister = () => {
    if (isLoading) return;
    setIsLoading(true);

    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 120,
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
      navigation.navigate("VerifyAccount", { email });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={["#a18cd1", "#fbc2eb", "#fad0c4"]}
        style={styles.background}
      >
        {/* Floating icons */}
        <Animated.View
          style={[styles.bgIcon, { top: 100, left: 40, transform: [{ translateY: floatTranslate }] }]}
        >
          <FontAwesome5 name="shopping-bag" size={42} color="rgba(255,255,255,0.4)" />
        </Animated.View>
        <Animated.View
          style={[styles.bgIcon, { bottom: 150, right: 60, transform: [{ translateY: floatTranslate }] }]}
        >
          <AntDesign name="heart" size={40} color="rgba(255,255,255,0.35)" />
        </Animated.View>
        <Animated.View
          style={[styles.bgIcon, { top: 250, right: 80, transform: [{ translateY: floatTranslate }] }]}
        >
          <Ionicons name="cart-outline" size={50} color="rgba(255,255,255,0.35)" />
        </Animated.View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}
            >
              {/* Logo */}
              <Animated.Image
                source={require("../../assets/images/J5storeLogo.png")} // <-- replace with your path
                style={[styles.logo, { transform: [{ scale: logoScale }] }]}
                resizeMode="contain"
              />

              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join J5store today ✨</Text>

              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Feather name="user" size={20} color="#ff6b6b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#bbb"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Feather name="mail" size={20} color="#ff6b6b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#bbb"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#ff6b6b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#bbb"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  style={styles.visibilityToggle}
                >
                  <Feather
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color="#ff6b6b"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#ff6b6b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#bbb"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!isConfirmPasswordVisible}
                />
                <TouchableOpacity
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  style={styles.visibilityToggle}
                >
                  <Feather
                    name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color="#ff6b6b"
                  />
                </TouchableOpacity>
              </View>

              {/* Register Button */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={handleRegister}
                  disabled={isLoading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={["#ff6b6b", "#ff9e7d"]}
                    style={styles.gradientButton}
                  >
                    {isLoading ? (
                      <Feather name="loader" size={20} color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.registerButtonText}>Sign Up</Text>
                        <Ionicons
                          name="arrow-forward-circle"
                          size={22}
                          color="#fff"
                          style={{ marginLeft: 8 }}
                        />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.footerLink}> Sign In</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width, height },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 20 },
  bgIcon: { position: "absolute" },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  logo: { width: 120, height: 80, alignSelf: "center", marginBottom: 10 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    color: "#fff",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#eee",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 16, color: "#fff" },
  visibilityToggle: { padding: 6 },
  registerButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 20,
    elevation: 3,
  },
  gradientButton: {
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center" },
  footerText: { fontSize: 14, color: "#ffffffff" },
  footerLink: { fontSize: 14, fontWeight: "700", color: "#fff" },
});

export default RegisterScreen;
