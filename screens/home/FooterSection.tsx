import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchProducts } from "../../store/slices/productSlice";

const { width, height } = Dimensions.get("window");

// Sparkle colors
const SPARKLE_COLORS = [
  "#FFD700",
  "#FF69B4",
  "#00FFFF",
  "#FFA500",
  "#ADFF2F",
  "#FF4500",
];

// Generate sparkles with randomness
const createSparkles = (count: number) =>
  Array.from({ length: count }, () => {
    const size = Math.random() * 10 + 4; // 4px–14px
    return {
      spin: new Animated.Value(0),
      radius: Math.random() * 100 + 60, // 60px–160px orbit
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0),
      size,
      delay: Math.random() * 2000,
      duration: 1000 + Math.random() * 1500, // each sparkle has unique speed
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
    };
  });

// Generate pulsating rings
const createRings = (count: number) =>
  Array.from({ length: count }, () => ({
    scale: new Animated.Value(0),
    opacity: new Animated.Value(0),
    delay: Math.random() * 1500,
  }));

const FooterSection = ({ theme, error, loading, dispatch }: any) => {
  const [showContent, setShowContent] = useState(false);

  // Animations
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowRotate = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;

  const sparkles = useRef(createSparkles(20)).current;
  const rings = useRef(createRings(3)).current;

  useEffect(() => {
    if (loading) {
      // Logo pulsing
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.1,
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0.9,
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.8,
              duration: 1200,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();

      // Continuous rotation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 6000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Glow orbit rotation
      Animated.loop(
        Animated.timing(glowRotate, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Bounce effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -15,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 700,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Sparkles animations with unique timings
      sparkles.forEach((s) => {
        // Spin continuously at random speeds
        Animated.loop(
          Animated.timing(s.spin, {
            toValue: 1,
            duration: 4000 + Math.random() * 4000, // 4s–8s per orbit
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();

        // Twinkle
        Animated.loop(
          Animated.sequence([
            Animated.delay(s.delay),
            Animated.timing(s.scale, {
              toValue: 1,
              duration: s.duration,
              useNativeDriver: true,
            }),
            Animated.timing(s.scale, {
              toValue: 0,
              duration: s.duration,
              useNativeDriver: true,
            }),
          ])
        ).start();

        Animated.loop(
          Animated.sequence([
            Animated.delay(s.delay),
            Animated.timing(s.opacity, {
              toValue: 1,
              duration: s.duration,
              useNativeDriver: true,
            }),
            Animated.timing(s.opacity, {
              toValue: 0,
              duration: s.duration,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });

      // Pulsating rings
      rings.forEach((r) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(r.delay),
            Animated.parallel([
              Animated.timing(r.scale, {
                toValue: 2.8,
                duration: 2400,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(r.opacity, {
                toValue: 0,
                duration: 2400,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(r.scale, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
              Animated.timing(r.opacity, {
                toValue: 0.3,
                duration: 0,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      });

      // Fade-in text
      Animated.timing(textFade, {
        toValue: 1,
        duration: 2000,
        delay: 2000,
        useNativeDriver: true,
      }).start();

      // Show content after 8s
      const timer = setTimeout(() => setShowContent(true), 8000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Loading screen
  if (loading && !showContent) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
          width,
          height,
        }}
      >
        <View style={{ position: "relative", alignItems: "center" }}>
          {/* Pulsating Rings */}
          {rings.map((r, i) => (
            <Animated.View
              key={i}
              style={{
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 2,
                borderColor: "rgba(255,215,0,0.4)",
                transform: [{ scale: r.scale }],
                opacity: r.opacity,
              }}
            />
          ))}

          {/* Orbiting Glow */}
          <Animated.View
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: "rgba(255,215,0,0.12)",
              transform: [
                {
                  rotate: glowRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          />

          {/* Sparkles */}
          {sparkles.map((s, index) => {
            const rotate = s.spin.interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "360deg"],
            });
            return (
              <Animated.View
                key={index}
                style={{
                  position: "absolute",
                  width: s.size,
                  height: s.size,
                  borderRadius: s.size / 2,
                  backgroundColor: s.color,
                  transform: [
                    { rotate },
                    { translateX: s.radius },
                    { scale: s.scale },
                  ],
                  opacity: s.opacity,
                }}
              />
            );
          })}

          {/* Animated Logo */}
          <Animated.Image
            source={require("../../assets/images/J5storeLogo.png")}
            style={{
              width: 95,
              height: 95,
              transform: [
                { scale: scaleAnim },
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
                { translateY: bounceAnim },
              ],
              opacity: opacityAnim,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Fade-in Text */}
        <Animated.Text
          style={{
            marginTop: 20,
            fontSize: 18,
            textAlign: "center",
            color: theme.secondaryText,
            opacity: textFade,
          }}
        >
          Preparing your shopping experience...
        </Animated.Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginTop: 16,
            marginBottom: 8,
            textAlign: "center",
            color: theme.text,
          }}
        >
          Failed to load products
        </Text>
        <Text
          style={{
            fontSize: 14,
            textAlign: "center",
            marginBottom: 20,
            color: theme.secondaryText,
          }}
        >
          {error}
        </Text>
        <TouchableOpacity
          style={{
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: theme.primary,
          }}
          onPress={() => dispatch(fetchProducts())}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // End of list footer
  return (
    <View
      style={{
        alignItems: "center",
        padding: 30,
        marginTop: 20,
        borderRadius: 16,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.card,
      }}
    >
      <Ionicons name="leaf" size={24} color={theme.primary} />
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          marginTop: 10,
          textAlign: "center",
          color: theme.text,
        }}
      >
        You've reached the end of today's recommendations
      </Text>
      <Text
        style={{
          fontSize: 14,
          marginTop: 5,
          textAlign: "center",
          color: theme.secondaryText,
        }}
      >
        Check back tomorrow for new arrivals!
      </Text>
    </View>
  );
};

export default FooterSection;
