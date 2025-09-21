import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Easing,
  Platform,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from 'expo-linear-gradient'; 
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';

// Import components
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import TrendingSection from "./components/TrendingSection";
import TestimonialsSection from "./components/TestimonialSection"; 
import NewsletterSection from "./components/NewsletterSection";
import AuthSection from "./components/AuthSection";

// Import hooks and utils
import { useDataFetch } from "./hooks/useDataFetch";
import { fetchTrendingProducts, fetchTestimonials } from "./utils/api";
import { LandingScreenNavigationProp } from "./types";

const { width, height } = Dimensions.get("window");

const LandingScreen = () => {
  const navigation = useNavigation<LandingScreenNavigationProp>();
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const featureAnim1 = useRef(new Animated.Value(0)).current;
  const featureAnim2 = useRef(new Animated.Value(0)).current;
  const featureAnim3 = useRef(new Animated.Value(0)).current;
  const trendingAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const screenTransitionAnim = useRef(new Animated.Value(0)).current;
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);

  // Use custom hooks for data fetching
  const { data: trendingProducts, loading: trendingLoading } = useDataFetch(fetchTrendingProducts, 'trending-products');
  const { data: testimonials, loading: testimonialsLoading } = useDataFetch(fetchTestimonials, 'testimonials');

  // Analytics functions
  const trackScreenView = (screenName: string) => {
    console.log('Screen viewed:', screenName);
  };

  const trackSectionView = (sectionName: string) => {
    console.log('Section viewed:', sectionName);
  };

  const trackButtonClick = (buttonName: string) => {
    console.log('Button clicked:', buttonName);
  };

  const trackProductView = (product: any) => {
    console.log('Product viewed:', product.name);
  };

  // Get user location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        }
      } catch (error) {
        console.log('Location permission denied or error:', error);
      }
    })();
  }, []);

  // Accessibility focus management
  const mainContentRef = useRef<ScrollView>(null);
  
  const focusMainContent = useCallback(() => {
    if (mainContentRef.current) {
      const reactTag = findNodeHandle(mainContentRef.current);
      if (reactTag) {
        AccessibilityInfo.setAccessibilityFocus(reactTag);
      }
    }
  }, []);

  // Pulse animation for CTA button
  useEffect(() => {
    Animated.loop(
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
    ).start();
  }, []);

  // Staggered animations for features
  useEffect(() => {
    Animated.stagger(200, [
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
    ]).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Trending items animation
    Animated.timing(trendingAnim, {
      toValue: 1,
      duration: 800,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // Track screen view (analytics)
    trackScreenView('Landing Screen');

    // Cleanup function
    return () => {
      fadeAnim.stopAnimation();
      featureAnim1.stopAnimation();
      featureAnim2.stopAnimation();
      featureAnim3.stopAnimation();
      trendingAnim.stopAnimation();
      pulseAnim.stopAnimation();
      screenTransitionAnim.stopAnimation();
    };
  }, []);

  // Animation for screen transitions
  const animateScreenTransition = (screenName: "Login" | "Register") => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Create a sequence of animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(screenTransitionAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(100),
    ]).start(() => {
      // Navigate to the target screen
      navigation.navigate(screenName);

      // Reset animation after a delay
      setTimeout(() => {
        screenTransitionAnim.setValue(0);
        setIsTransitioning(false);
      }, 500);
    });
  };

  // Personalization functions
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning!";
    if (hour < 17) return "Good Afternoon!";
    return "Good Evening!";
  };

  const getLocationBasedGreeting = () => {
    if (!location) return "";
    return " in Your Area";
  };

  // Interpolation values
  const featureScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: "clamp",
  });

  const trendingOpacity = trendingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const trendingTranslateX = trendingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const feature1TranslateY = featureAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const feature2TranslateY = featureAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const feature3TranslateY = featureAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const feature1Opacity = featureAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const feature2Opacity = featureAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const feature3Opacity = featureAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const screenScale = screenTransitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
  });

  const screenOpacity = screenTransitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.7],
  });

  const screenTranslateY = screenTransitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const onButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleTrendingItemPress = (item: any) => {
    trackProductView(item);
  };

  const handleSubscribe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    trackButtonClick('Newsletter Subscribe');
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: screenOpacity,
          transform: [{ scale: screenScale }, { translateY: screenTranslateY }],
        },
      ]}
      accessibilityRole="scrollbar"
    >
      {/* Skip to content link for screen readers */}
      {Platform.OS === 'web' && (
        <TouchableOpacity
          style={styles.skipLink}
          onPress={focusMainContent}
          accessibilityLabel="Skip to main content"
        >
          <Text style={styles.skipLinkText}>Skip to main content</Text>
        </TouchableOpacity>
      )}

      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        ref={mainContentRef}
        accessibilityLabel="StyleHub landing page"
      >
        {/* Hero Section */}
        <HeroSection
          scrollY={scrollY}
          heroImageError={heroImageError}
          onImageLoad={() => setImagesLoaded(true)}
          onImageError={() => setHeroImageError(true)}
          getGreeting={getGreeting}
          getLocationBasedGreeting={getLocationBasedGreeting}
        />

        {/* Features Section */}
        <FeaturesSection
          scrollY={scrollY}
          featureScale={featureScale}
          featureAnim1={featureAnim1}
          featureAnim2={featureAnim2}
          featureAnim3={featureAnim3}
          feature1TranslateY={feature1TranslateY}
          feature2TranslateY={feature2TranslateY}
          feature3TranslateY={feature3TranslateY}
          feature1Opacity={feature1Opacity}
          feature2Opacity={feature2Opacity}
          feature3Opacity={feature3Opacity}
          onLayout={() => trackSectionView('Features')}
        />

        {/* Trending Section */}
        <TrendingSection
          trendingOpacity={trendingOpacity}
          trendingTranslateX={trendingTranslateX}
          trendingProducts={trendingProducts}
          trendingLoading={trendingLoading}
          onLayout={() => trackSectionView('Trending Products')}
          onViewAll={() => trackButtonClick('View All Trending')}
          onItemPress={handleTrendingItemPress}
        />

        {/* Testimonials Section */}
        <TestimonialsSection
          testimonials={testimonials}
          testimonialsLoading={testimonialsLoading}
          onLayout={() => trackSectionView('Testimonials')}
        />

        {/* Newsletter Section */}
        <NewsletterSection
          onLayout={() => trackSectionView('Newsletter')}
          onSubscribe={handleSubscribe}
          onButtonPressIn={onButtonPressIn}
          onButtonPressOut={onButtonPressOut}
          buttonScale={buttonScale}
        />

        {/* Auth Section */}
        <AuthSection
          fadeAnim={fadeAnim}
          pulseAnim={pulseAnim}
          isTransitioning={isTransitioning}
          onLayout={() => trackSectionView('Authentication')}
          onGetStarted={() => {
            trackButtonClick('Get Started');
            animateScreenTransition("Register");
          }}
          onSignIn={() => {
            trackButtonClick('Sign In');
            animateScreenTransition("Login");
          }}
          onButtonPressIn={onButtonPressIn}
          onButtonPressOut={onButtonPressOut}
        />
      </Animated.ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  skipLink: {
    position: 'absolute',
    top: -40,
    left: 10,
    backgroundColor: '#000',
    padding: 10,
    zIndex: 100,
  },
  skipLinkText: {
    color: '#fff',
  },
});

export default LandingScreen;