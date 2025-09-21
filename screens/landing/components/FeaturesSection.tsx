import React from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import FeatureCard from "./FeatureCard";

const { width } = Dimensions.get("window");

interface FeaturesSectionProps {
  scrollY: Animated.Value;
  featureScale: Animated.AnimatedInterpolation<number>;
  featureAnim1: Animated.Value;
  featureAnim2: Animated.Value;
  featureAnim3: Animated.Value;
  feature1TranslateY: Animated.AnimatedInterpolation<number>;
  feature2TranslateY: Animated.AnimatedInterpolation<number>;
  feature3TranslateY: Animated.AnimatedInterpolation<number>;
  feature1Opacity: Animated.AnimatedInterpolation<number>;
  feature2Opacity: Animated.AnimatedInterpolation<number>;
  feature3Opacity: Animated.AnimatedInterpolation<number>;
  onLayout: () => void;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  scrollY,
  featureScale,
  featureAnim1,
  featureAnim2,
  featureAnim3,
  feature1TranslateY,
  feature2TranslateY,
  feature3TranslateY,
  feature1Opacity,
  feature2Opacity,
  feature3Opacity,
  onLayout
}) => {
  return (
    <Animated.View
      style={[styles.section, { transform: [{ scale: featureScale }] }]}
      onLayout={onLayout}
      accessibilityLabel="Why Shop With Us section"
    >
      <Text style={styles.sectionTitle}>Why Shop With Us?</Text>
      <View style={styles.features}>
        <FeatureCard
          animationSource={require('../../assets/animations/delivery-truck.json')}
          title="Free Shipping"
          description="On all orders over $50. Delivered within 2-5 business days."
          translateY={feature1TranslateY}
          opacity={feature1Opacity}
        />
        
        <FeatureCard
          animationSource={require('../../assets/animations/quality-check.json')}
          title="Premium Quality"
          description="Curated collections from top designers and brands worldwide."
          translateY={feature2TranslateY}
          opacity={feature2Opacity}
        />
        
        <FeatureCard
          animationSource={require('../../assets/animations/security-shield.json')}
          title="Secure Payment"
          description="256-bit encryption with multiple payment options available."
          translateY={feature3TranslateY}
          opacity={feature3Opacity}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 30,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
    color: "#1f2937",
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
});

export default FeaturesSection;