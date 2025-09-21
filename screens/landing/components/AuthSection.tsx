import React from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from "@expo/vector-icons";

interface AuthSectionProps {
  fadeAnim: Animated.Value;
  pulseAnim: Animated.AnimatedInterpolation<number>;
  isTransitioning: boolean;
  onLayout: () => void;
  onGetStarted: () => void;
  onSignIn: () => void;
  onButtonPressIn: () => void;
  onButtonPressOut: () => void;
}

const AuthSection: React.FC<AuthSectionProps> = ({
  fadeAnim,
  pulseAnim,
  isTransitioning,
  onLayout,
  onGetStarted,
  onSignIn,
  onButtonPressIn,
  onButtonPressOut
}) => {
  return (
    <Animated.View 
      style={[styles.authSection, { opacity: fadeAnim }]}
      onLayout={onLayout}
      accessibilityLabel="Join our community"
    >
      <Text style={styles.authTitle}>Join Our Community</Text>
      <Text style={styles.authSubtitle}>
        Sign up for exclusive offers and updates
      </Text>

      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={onGetStarted}
          onPressIn={onButtonPressIn}
          onPressOut={onButtonPressOut}
          disabled={isTransitioning}
          accessibilityLabel="Get started with StyleHub"
          accessibilityRole="button"
          accessibilityHint="Create a new account to start shopping"
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.signupButtonText}>Get Started</Text>
            <Feather
              name="arrow-right"
              size={20}
              color="#fff"
              style={styles.buttonIcon}
              accessibilityLabel="Arrow right icon"
            />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={onSignIn}
        disabled={isTransitioning}
        accessibilityLabel="Already have an account? Sign in"
        accessibilityRole="button"
        accessibilityHint="Sign in to your existing account"
      >
        <Text style={styles.loginButtonText}>
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  authSection: {
    padding: 40,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1f2937",
  },
  authSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 30,
    textAlign: "center",
  },
  signupButton: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 25,
    overflow: "hidden",
  },
  gradientButton: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  loginButton: {
    padding: 15,
  },
  loginButtonText: {
    color: "#0ea5e9",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default AuthSection;