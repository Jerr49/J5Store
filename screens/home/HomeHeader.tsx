import React from "react";
import { View, Text, TouchableOpacity, Animated, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../../components/common/SearchBar";
import FlashSaleCountdown from "../../components/home/FlashSaleCountdown";

const HomeHeader = ({ navigation, scrollY, isDarkMode, toggleTheme, cartItemsCount, theme }: any) => {
  const headerHeight = scrollY.interpolate({ inputRange: [0, 100], outputRange: [180, 80], extrapolate: "clamp" });
  const headerOpacity = scrollY.interpolate({ inputRange: [0, 80], outputRange: [1, 0], extrapolate: "clamp" });

  return (
    <Animated.View style={{ height: headerHeight, backgroundColor: theme.card, borderBottomColor: theme.border, paddingHorizontal: 20, paddingTop: Platform.OS === "ios" ? 10 : 20, borderBottomWidth: 1, zIndex: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 15 }}>
        <Animated.View style={{ flex: 1, opacity: headerOpacity }}>
          <Text style={{ color: theme.secondaryText, fontSize: 14, marginBottom: 4 }}>Hello, Welcome back!</Text>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "bold" }}>What are you looking for today?</Text>
        </Animated.View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={toggleTheme} style={{ padding: 8, marginRight: 10 }}>
            <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={24} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={{ padding: 8, marginLeft: 10, position: "relative" }}>
            <Ionicons name="cart-outline" size={24} color={theme.text} />
            {cartItemsCount > 0 && (
              <View style={{ position: "absolute", top: 4, right: 4, backgroundColor: "#ef4444", borderRadius: 10, minWidth: 18, height: 18, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "bold" }}>{cartItemsCount > 99 ? "99+" : cartItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar placeholder="Search products, brands, and categories..." onFocus={() => navigation.navigate("Search")} style={{ marginBottom: 15 }} />

      <FlashSaleCountdown endTime={Date.now() + 24 * 60 * 60 * 1000} onPress={() => navigation.navigate("FlashSale")} />
    </Animated.View>
  );
};

export default HomeHeader;
