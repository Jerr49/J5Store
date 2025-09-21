import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather, FontAwesome5, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../components/navigation/MainNavigator";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";
import { RootState } from "../../store";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(80)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

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
    outputRange: [0, -20],
  });

  const handleLogin = () => {
    if (loading) return;
    dispatch(loginStart());

    // Simulate API request
    setTimeout(() => {
      if (email === "test@test.com" && password === "1234") {
        // ✅ Fake user object with required isAdmin
        dispatch(
          loginSuccess({
            id: "1",
            name: "Test User",
            email,
            isAdmin: false, // 👈 Add this to satisfy User type
          })
        );
      } else {
        dispatch(loginFailure("Invalid credentials"));
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Gradient Background */}
      <LinearGradient
        colors={["#ff9a9e", "#fad0c4", "#fad390"]}
        style={styles.background}
      >
        {/* Decorative Orbs */}
        <View style={[styles.orb, { top: 80, left: -50 }]} />
        <View style={[styles.orb, { bottom: 120, right: -60 }]} />

        {/* Floating Shopping Icons */}
        <Animated.View
          style={[
            styles.bgIcon,
            { top: 120, left: 40, transform: [{ translateY: floatTranslate }] },
          ]}
        >
          <FontAwesome5
            name="shopping-bag"
            size={42}
            color="rgba(255,255,255,0.45)"
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.bgIcon,
            { bottom: 160, right: 60, transform: [{ translateY: floatTranslate }] },
          ]}
        >
          <AntDesign name="heart" size={40} color="rgba(255,255,255,0.35)" />
        </Animated.View>
        <Animated.View
          style={[
            styles.bgIcon,
            { top: 240, right: 80, transform: [{ translateY: floatTranslate }] },
          ]}
        >
          <Ionicons
            name="cart-outline"
            size={50}
            color="rgba(255,255,255,0.35)"
          />
        </Animated.View>
      </LinearGradient>

      {/* Card Content */}
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.card,
            { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] },
          ]}
        >
          {/* Logo */}
          <Image
            source={require("../../assets/images/J5storeLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Sign in to continue shopping</Text>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#ff6b6b"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#bbb"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#ff6b6b"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#bbb"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {/* Error */}
          {error && (
            <Text style={{ color: "red", textAlign: "center", marginBottom: 8 }}>
              {error}
            </Text>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#ff6b6b", "#ff9e7d"]}
              style={styles.gradientButton}
            >
              {loading ? (
                <Feather name="loader" size={20} color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginText}>Login</Text>
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

          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}> Register</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    position: "absolute",
    width,
    height,
  },
  orb: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  bgIcon: { position: "absolute" },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 25,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  logo: {
    width: 110,
    height: 110,
    alignSelf: "center",
    marginBottom: 12,
  },
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
    marginBottom: 22,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 16, color: "#fff" },
  loginButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 22,
    elevation: 3,
  },
  gradientButton: {
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  registerContainer: { flexDirection: "row", justifyContent: "center" },
  registerText: { fontSize: 14, color: "rgba(255, 255, 255, 1)" },
  registerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 1)",
    marginLeft: 4,
  },
});

export default LoginScreen;
