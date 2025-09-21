import { Animated, Easing } from "react-native";

export const createPulseAnimation = (pulseAnim: Animated.Value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ])
  );
};

export const createStaggeredAnimations = (
  featureAnim1: Animated.Value,
  featureAnim2: Animated.Value,
  featureAnim3: Animated.Value
) => {
  return Animated.stagger(200, [
    Animated.timing(featureAnim1, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }),
    Animated.timing(featureAnim2, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }),
    Animated.timing(featureAnim3, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }),
  ]);
};

export const stopAllAnimations = (
  fadeAnim: Animated.Value,
  featureAnim1: Animated.Value,
  featureAnim2: Animated.Value,
  featureAnim3: Animated.Value,
  trendingAnim: Animated.Value,
  pulseAnim: Animated.Value,
  screenTransitionAnim: Animated.Value
) => {
  fadeAnim.stopAnimation();
  featureAnim1.stopAnimation();
  featureAnim2.stopAnimation();
  featureAnim3.stopAnimation();
  trendingAnim.stopAnimation();
  pulseAnim.stopAnimation();
  screenTransitionAnim.stopAnimation();
};