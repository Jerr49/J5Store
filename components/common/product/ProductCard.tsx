import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { toggleFavorite } from "../../../store/slices/productSlice";
import { addToCart } from "../../../store/slices/cartSlice";
import Icon from "react-native-vector-icons/Ionicons";
import { Product } from "../../../types/index";
import { HomeStackParamList } from "../../../components/navigation/TabNavigator";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../../constants/theme"; // Import your enhanced theme hook

interface ProductCardProps {
  product: Product;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const { colors, shadows, spacing, borderRadius, isDark } = useTheme(); // Use the enhanced theme

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const favoriteScale = useRef(new Animated.Value(1)).current;

  const handleToggleFavorite = () => {
    Animated.sequence([
      Animated.timing(favoriteScale, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(favoriteScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    dispatch(toggleFavorite(product.id));
  };

  const handlePress = () => {
    navigation.navigate("ProductDetail", { productId: product.id });
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          { 
            backgroundColor: colors.card,
            borderRadius: borderRadius.lg,
            margin: spacing.sm,
            ...shadows.medium, // Apply theme-based shadow
          },
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Discount/New badges */}
          <View style={styles.badgesContainer}>
            {hasDiscount && (
              <View style={[styles.badge, styles.discountBadge]}>
                <Text style={styles.badgeText}>-{discountPercentage}%</Text>
              </View>
            )}
            {product.isNew && (
              <View style={[styles.badge, styles.newBadge]}>
                <Text style={styles.badgeText}>New</Text>
              </View>
            )}
          </View>

          {/* Favorite button */}
          <Animated.View style={{ transform: [{ scale: favoriteScale }] }}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
            >
              <LinearGradient
                colors={
                  product.isFavorite
                    ? ["#FF3B30", "#FF5E51"]
                    : ["rgba(255,255,255,0.9)", "rgba(255,255,255,0.9)"]
                }
                style={styles.favoriteGradient}
              >
                <Icon
                  name={product.isFavorite ? "heart" : "heart-outline"}
                  size={16}
                  color={
                    product.isFavorite ? "#FFF" : colors.icon
                  }
                />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Info */}
        <View style={[styles.infoContainer, { padding: spacing.md }]}>
          <Text
            style={[
              styles.category,
              { color: colors.secondaryText },
            ]}
            numberOfLines={1}
          >
            {product.category}
          </Text>

          <Text
            style={[styles.name, { color: colors.text }]}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  name={
                    star <= Math.floor(product.rating) ? "star" : "star-outline"
                  }
                  size={12}
                  color="#FFC107"
                />
              ))}
            </View>
            <Text
              style={[
                styles.ratingText,
                { color: colors.secondaryText },
              ]}
            >
              {product.rating} ({product.reviewCount || 0})
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.primary }]}>
              ${product.price.toFixed(2)}
            </Text>
            {hasDiscount && (
              <Text style={styles.originalPrice}>
                ${product.originalPrice!.toFixed(2)}
              </Text>
            )}
          </View>

          {/* Add to Cart */}
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.cartButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="cart-outline" size={16} color="#FFF" />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    overflow: "hidden",
    position: "relative",
  },
  imageContainer: {
    position: "relative",
    height: 180,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgesContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    gap: 4,
  },
  badge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountBadge: {
    backgroundColor: "#FF3B30",
  },
  newBadge: {
    backgroundColor: "#10B981",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
  favoriteGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    // padding now set dynamically with theme spacing
  },
  category: {
    fontSize: 11,
    marginBottom: 4,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  ratingStars: {
    flexDirection: "row",
    marginRight: 4,
  },
  ratingText: {
    fontSize: 11,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
  },
  originalPrice: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  addToCartButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  cartButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ProductCard;