import React from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
// import { AnimatedInterpolation } from "../types";

const { width } = Dimensions.get("window");

interface HeroSectionProps {
  scrollY: Animated.Value;
  heroImageError: boolean;
  onImageLoad: () => void;
  onImageError: () => void;
  getGreeting: () => string;
  getLocationBasedGreeting: () => string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  scrollY,
  heroImageError,
  onImageLoad,
  onImageError,
  getGreeting,
  getLocationBasedGreeting,
}) => {
  const heroScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.2, 1, 0.9],
    extrapolate: "clamp",
  });

  const heroOpacity = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0.3],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  // Create animated styles for the image
  const imageAnimatedStyle = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [0, 300],
          outputRange: [0, 100],
          extrapolate: "clamp",
        }),
      },
      { scale: heroScale },
    ],
    opacity: heroOpacity,
  };

  // Create animated styles for the header
  const headerAnimatedStyle = {
    opacity: headerOpacity,
    transform: [{ translateY: headerTranslateY }],
  };

  return (
    <View style={styles.heroSection}>
        
      <Animated.Image
        source={{
          uri: heroImageError
            ? "https://images.unsplash.com/photo-1566206091558-7f218b696731"
            : "https://images.unsplash.com/photo-1563014959-7aaa83350992",
        }}
        style={[styles.heroImage, imageAnimatedStyle]}
        onLoad={onImageLoad}
        onError={onImageError}
        accessibilityLabel="Fashion model showcasing StyleHub clothing"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]}
        locations={[0, 0.5, 1]}
        style={styles.heroGradient}
      >
        <Animated.View style={headerAnimatedStyle} accessibilityRole="header">
          <Text style={styles.heroTitle}>
            {getGreeting()} Welcome to StyleHub{getLocationBasedGreeting()}
          </Text>
          <Text style={styles.heroSubtitle}>
            Elevate Your Shopping Experience
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.statItem} accessibilityRole="text">
              <Text style={styles.statNumber}>10K+</Text>
              <Text style={styles.statLabel}>Happy Customers</Text>
            </View>
            <View style={styles.statItem} accessibilityRole="text">
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Brands</Text>
            </View>
            <View style={styles.statItem} accessibilityRole="text">
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Support</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    height: 500,
    position: "relative",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
    justifyContent: "flex-end",
    padding: 30,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.9,
    fontWeight: "300",
    marginBottom: 25,
  },
  heroStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
});

export default HeroSection;
