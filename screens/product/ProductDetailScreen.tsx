import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { RootState } from "../../store";
import { HomeStackParamList } from "../../components/navigation/TabNavigator";
import { useAppDispatch } from "../../store/hooks";
import { addToCart } from "../../store/slices/cartSlice";

type ProductDetailScreenRouteProp = RouteProp<
  HomeStackParamList,
  "ProductDetail"
>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

  const { productId } = route.params;
  const dispatch = useAppDispatch();

  // Selection states
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Theme
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const bgColor = isDarkMode ? "#1F2937" : "#fff";
  const textColor = isDarkMode ? "#F3F4F6" : "#1F2937";
  const subTextColor = isDarkMode ? "#D1D5DB" : "#6B7280";
  const borderColor = isDarkMode ? "#374151" : "#E5E7EB";

  const product = useSelector((state: RootState) =>
    state.products.products.find((p) => String(p.id) === String(productId))
  );

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    navigation.navigate("Checkout" as any, { product });
  };

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <Text style={[styles.errorText, { color: subTextColor }]}>
          Product not found
        </Text>
      </View>
    );
  }

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      Black: "#000000",
      White: "#FFFFFF",
      Gray: "#808080",
      Silver: "#C0C0C0",
      Blue: "#0000FF",
      Red: "#FF0000",
      Green: "#008000",
      Yellow: "#FFFF00",
      Purple: "#800080",
      Pink: "#FFC0CB",
      Orange: "#FFA500",
      Brown: "#A52A2A",
      Navy: "#000080",
      Burgundy: "#800020",
      Cream: "#FFFDD0",
      "Light Blue": "#ADD8E6",
      Floral: "#FFD700",
    };
    return colorMap[colorName] || "#CCCCCC";
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      <Image source={{ uri: product.image }} style={styles.image} />

      {/* Badges */}
      <View style={styles.badgesContainer}>
        {hasDiscount && (
          <View style={[styles.badge, styles.discountBadge]}>
            <Text style={styles.badgeText}>-{discountPercentage}% OFF</Text>
          </View>
        )}
        {product.isNew && (
          <View style={[styles.badge, styles.newBadge]}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}
        {!product.inStock && (
          <View style={[styles.badge, styles.outOfStockBadge]}>
            <Text style={styles.badgeText}>OUT OF STOCK</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: textColor }]}>
              {product.name}
            </Text>
            {product.brand && (
              <Text style={[styles.brand, { color: subTextColor }]}>
                by {product.brand}
              </Text>
            )}
          </View>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: "#0EA5E9" }]}>
              ${product.price.toFixed(2)}
            </Text>
            {hasDiscount && (
              <Text style={[styles.originalPrice, { color: subTextColor }]}>
                ${product.originalPrice!.toFixed(2)}
              </Text>
            )}
          </View>
        </View>

        {/* Ratings */}
        <View style={styles.ratingContainer}>
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name={
                  star <= Math.floor(product.rating) ? "star" : "star-outline"
                }
                size={20}
                color="#FFC107"
              />
            ))}
          </View>
          <Text style={[styles.rating, { color: textColor }]}>
            {product.rating}
          </Text>
          <Text style={[styles.reviewCount, { color: subTextColor }]}>
            ({product.reviewCount} reviews)
          </Text>
          <Text style={[styles.category, { color: subTextColor }]}>
            {product.category}
          </Text>
        </View>

        {/* Colors */}
        {(product.colors || []).length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Color
            </Text>
            <View style={styles.colorsContainer}>
              {(product.colors || []).map((color, index) => {
                const isSelected = selectedColor === color;
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.colorOption}
                    onPress={() => setSelectedColor(color)}
                  >
                    <View
                      style={[
                        styles.colorCircle,
                        {
                          backgroundColor: getColorHex(color),
                          borderColor: isSelected ? "#0EA5E9" : borderColor,
                          borderWidth: isSelected ? 3 : 2,
                        },
                      ]}
                    />
                    <Text style={[styles.colorText, { color: subTextColor }]}>
                      {color}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Sizes */}
        {(product.sizes || []).length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Size
            </Text>
            <View style={styles.sizesContainer}>
              {(product.sizes || []).map((size, index) => {
                const isSelected = selectedSize === size;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.sizeOption,
                      {
                        borderColor: isSelected ? "#0EA5E9" : borderColor,
                        backgroundColor: bgColor,
                      },
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[styles.sizeText, { color: textColor }]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: subTextColor }]}>
            {product.description}
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Features
          </Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="#10B981" />
              <Text style={[styles.featureText, { color: subTextColor }]}>
                Free shipping on orders over $50
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="#10B981" />
              <Text style={[styles.featureText, { color: subTextColor }]}>
                30-day return policy
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="checkmark-circle" size={20} color="#10B981" />
              <Text style={[styles.featureText, { color: subTextColor }]}>
                2-year warranty
              </Text>
            </View>
          </View>
        </View>

        {/* Stock info */}
        <View style={styles.section}>
          <Text
            style={[
              styles.stockText,
              { color: product.inStock ? "#10B981" : "#EF4444" },
            ]}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Text>
          {product.inStock && (
            <Text style={[styles.shippingText, { color: subTextColor }]}>
              Ships within 1-3 business days
            </Text>
          )}
        </View>

        {/* Action buttons */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              !product.inStock && styles.addToCartButtonDisabled,
            ]}
            disabled={!product.inStock}
            onPress={handleAddToCart}
          >
            <Icon
              name="cart"
              size={20}
              color="#FFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.addToCartText}>
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buyNowButton,
              !product.inStock && styles.buyNowButtonDisabled,
            ]}
            disabled={!product.inStock}
            onPress={handleBuyNow}
          >
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: "100%", height: 400, resizeMode: "cover" },
  badgesContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    gap: 8,
  },
  badge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 },
  discountBadge: { backgroundColor: "#FF3B30" },
  newBadge: { backgroundColor: "#10B981" },
  outOfStockBadge: { backgroundColor: "#6B7280" },
  badgeText: { color: "#FFF", fontSize: 12, fontWeight: "bold" },
  content: { padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  titleContainer: { flex: 1, marginRight: 16 },
  title: { fontSize: 26, fontWeight: "bold" },
  brand: { fontSize: 16, fontStyle: "italic", marginBottom: 4 },
  priceContainer: { alignItems: "flex-end" },
  price: { fontSize: 24, fontWeight: "bold" },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: "line-through",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
  },
  ratingStars: { flexDirection: "row", marginRight: 8 },
  rating: { fontSize: 16, fontWeight: "600", marginRight: 8 },
  reviewCount: { fontSize: 14, marginRight: 16 },
  category: { fontSize: 14, fontStyle: "italic" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  colorsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  colorOption: { alignItems: "center", marginRight: 16 },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 4,
  },
  colorText: { fontSize: 12 },
  sizesContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  sizeText: { fontSize: 14 },
  description: { fontSize: 16, lineHeight: 24 },
  featuresList: { gap: 8 },
  featureItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureText: { fontSize: 14 },
  stockText: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  shippingText: { fontSize: 14 },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#0EA5E9",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartButtonDisabled: { backgroundColor: "#9CA3AF" },
  addToCartText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  buttonIcon: { marginRight: 8 },
  buyNowButton: {
    flex: 1,
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buyNowButtonDisabled: { backgroundColor: "#9CA3AF" },
  buyNowText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  errorText: { fontSize: 18, textAlign: "center", marginTop: 40 },
});

export default ProductDetailScreen;
