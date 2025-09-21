import React from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import LottieView from 'lottie-react-native';

interface FeatureCardProps {
  animationSource: any;
  title: string;
  description: string;
  translateY: Animated.AnimatedInterpolation<number>;
  opacity: Animated.AnimatedInterpolation<number>;
}

const { width } = Dimensions.get("window");

const FeatureCard: React.FC<FeatureCardProps> = ({
  animationSource,
  title,
  description,
  translateY,
  opacity
}) => {
  return (
    <Animated.View
      style={[
        styles.featureCard,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.featureIconContainer}>
        <LottieView
          source={animationSource}
          autoPlay
          loop
          style={styles.lottieIcon}
        />
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{description}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  featureCard: {
    width: (width - 80) / 3,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#f8fafc",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  lottieIcon: {
    width: 40,
    height: 40,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
    color: "#1f2937",
  },
  featureDesc: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 16,
  },
});

export default FeatureCard;