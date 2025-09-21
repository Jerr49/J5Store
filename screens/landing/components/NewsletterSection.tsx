import React from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from "@expo/vector-icons";

interface NewsletterSectionProps {
  onLayout: () => void;
  onSubscribe: () => void;
  onButtonPressIn: () => void;
  onButtonPressOut: () => void;
  buttonScale: Animated.Value;
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  onLayout,
  onSubscribe,
  onButtonPressIn,
  onButtonPressOut,
  buttonScale
}) => {
  return (
    <View 
      style={styles.newsletterSection}
      onLayout={onLayout}
      accessibilityLabel="Newsletter subscription"
    >
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.newsletterGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.newsletterTitle}>Stay Updated</Text>
        <Text style={styles.newsletterText}>
          Subscribe to our newsletter for exclusive deals and new arrivals
        </Text>
        <View style={styles.newsletterForm}>
          <View style={styles.inputContainer}>
            <Feather
              name="mail"
              size={20}
              color="#9ca3af"
              style={styles.inputIcon}
              accessibilityLabel="Email icon"
            />
            <Text style={styles.input}>Enter your email</Text>
          </View>
          <TouchableOpacity
            style={styles.subscribeButton}
            onPressIn={onButtonPressIn}
            onPressOut={onButtonPressOut}
            onPress={onSubscribe}
            accessibilityLabel="Subscribe to newsletter"
            accessibilityRole="button"
          >
            <Animated.Text
              style={[
                styles.subscribeText,
                { transform: [{ scale: buttonScale }] },
              ]}
            >
              Subscribe
            </Animated.Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  newsletterSection: {
    padding: 30,
  },
  newsletterGradient: {
    padding: 30,
    borderRadius: 20,
    overflow: "hidden",
  },
  newsletterTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  newsletterText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 20,
  },
  newsletterForm: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 50,
    overflow: "hidden",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    color: "#6b7280",
  },
  subscribeButton: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    backgroundColor: "#10b981",
  },
  subscribeText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default NewsletterSection;