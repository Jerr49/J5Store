// components/navigation/AppNavbar.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

const lightTheme = {
  background: "#fff",
  border: "#e5e7eb",
  text: "#6b7280",
  activeText: "#667eea",
  activeBackground: "rgba(102, 126, 234, 0.1)",
  iconInactive: "#6b7280",
  iconActive: "#667eea",
  badgeBackground: "#ff3b30",
};

const darkTheme = {
  background: "#1f2937",
  border: "#374151",
  text: "#d1d5db",
  activeText: "#a78bfa",
  activeBackground: "rgba(167, 139, 250, 0.15)",
  iconInactive: "#9ca3af",
  iconActive: "#a78bfa",
  badgeBackground: "#ff3b30",
};

const AppNavbar = ({ state, navigation }: BottomTabBarProps) => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  // Animation refs
  const badgeScale = useRef(new Animated.Value(1)).current;

  // Animate badge when cart count changes
  useEffect(() => {
    if (cartCount > 0) {
      Animated.sequence([
        Animated.spring(badgeScale, {
          toValue: 1.5,
          friction: 3,
          tension: 150,
          useNativeDriver: true,
        }),
        Animated.spring(badgeScale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  }, [cartCount]);

  const getTabName = (routeName: string): string => {
    switch (routeName) {
      case "HomeTab":
        return "Home";
      case "Cart":
        return "Cart";
      case "Orders":
        return "Orders";
      case "Profile":
        return "Profile";
      case "Settings":
        return "Settings";
      default:
        return routeName;
    }
  };

  const getIconName = (routeName: string): FeatherIconName => {
    switch (routeName) {
      case "HomeTab":
        return "home";
      case "Cart":
        return "shopping-cart";
      case "Orders":
        return "shopping-bag";
      case "Profile":
        return "user";
      case "Settings":
        return "settings";
      default:
        return "circle";
    }
  };

  return (
    <View
      style={[
        styles.navbar,
        { backgroundColor: theme.background, borderTopColor: theme.border },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tabName = getTabName(route.name);
        const iconName = getIconName(route.name);

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={[
              styles.navItem,
              isFocused && { backgroundColor: theme.activeBackground },
            ]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            <View>
              <Feather
                name={iconName}
                size={24}
                color={isFocused ? theme.iconActive : theme.iconInactive}
              />
              {/* Cart badge */}
              {route.name === "Cart" && cartCount > 0 && (
                <Animated.View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: theme.badgeBackground,
                      transform: [{ scale: badgeScale }],
                    },
                  ]}
                >
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </Animated.View>
              )}
            </View>
            <Text
              style={[
                styles.navText,
                { color: isFocused ? theme.activeText : theme.text },
                isFocused && styles.activeNavText,
              ]}
            >
              {tabName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
  activeNavText: {
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default AppNavbar;
