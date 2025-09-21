// components/screens/CartScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context"; 
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootState } from "../../store";
import {
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} from "../../store/slices/cartSlice";
import { AppRootStackParamList } from "../../components/navigation/RootNavigator"; 

type CheckoutNavProp = StackNavigationProp<AppRootStackParamList, "Checkout">;

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<CheckoutNavProp>(); // ✅ navigation

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartTotal = useSelector((state: RootState) => state.cart.total);
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  const colors = {
    background: isDarkMode ? "#111827" : "#f9fafb",
    card: isDarkMode ? "#1f2937" : "#fff",
    text: isDarkMode ? "#f9fafb" : "#1f2937",
    subtext: isDarkMode ? "#9ca3af" : "#6b7280",
    border: isDarkMode ? "#374151" : "#e5e7eb",
    accent: "#667eea",
    danger: "#ef4444",
    buttonText: "#fff",
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          onPress: () => dispatch(clearCart()),
          style: "destructive",
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Your cart is empty", "Add some items to proceed to checkout.");
      return;
    }
    navigation.navigate("Checkout");
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View
      style={[
        styles.cartItem,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={[styles.cartItemName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.cartItemPrice, { color: colors.accent }]}>
          ${item.price.toFixed(2)}
        </Text>
        <Text style={[styles.cartItemCategory, { color: colors.subtext }]}>
          {item.category}
        </Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={[styles.quantityButton, { backgroundColor: isDarkMode ? "#374151" : "#f3f4f6" }]}
          onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
        >
          <Ionicons name="remove" size={16} color={colors.accent} />
        </TouchableOpacity>
        <Text style={[styles.quantityText, { color: colors.text }]}>{item.quantity}</Text>
        <TouchableOpacity
          style={[styles.quantityButton, { backgroundColor: isDarkMode ? "#374151" : "#f3f4f6" }]}
          onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={16} color={colors.accent} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item.id)}>
        <Ionicons name="trash-outline" size={20} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyCart}>
          <Ionicons name="cart-outline" size={80} color={colors.subtext} />
          <Text style={[styles.emptyCartText, { color: colors.text }]}>Your cart is empty</Text>
          <Text style={[styles.emptyCartSubtext, { color: colors.subtext }]}>
            Start shopping to add items to your cart
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Shopping Cart</Text>
        <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
          <Text style={[styles.clearButtonText, { color: colors.danger }]}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View style={styles.totalContainer}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total:</Text>
          <Text style={[styles.totalAmount, { color: colors.accent }]}>
            ${cartTotal.toFixed(2)}
          </Text>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subtext }]}>Subtotal</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${cartTotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subtext }]}>Shipping</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {cartTotal > 50 ? "Free" : "$5.99"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subtext }]}>Tax</Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              ${(cartTotal * 0.08).toFixed(2)}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.checkoutButton, { backgroundColor: colors.accent }]} onPress={handleCheckout}>
          <Feather name="shopping-bag" size={20} color={colors.buttonText} />
          <Text style={[styles.checkoutButtonText, { color: colors.buttonText }]}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingBottom: 10, borderBottomWidth: 1 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  clearButton: { padding: 8 },
  clearButtonText: { fontSize: 14, fontWeight: "500" },
  cartList: { padding: 16 },
  cartItem: { flexDirection: "row", alignItems: "center", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1 },
  cartItemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  cartItemDetails: { flex: 1, marginRight: 12 },
  cartItemName: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cartItemPrice: { fontSize: 16, fontWeight: "bold", marginBottom: 2 },
  cartItemCategory: { fontSize: 12 },
  quantityControls: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  quantityButton: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  quantityText: { marginHorizontal: 12, fontSize: 16, fontWeight: "600", minWidth: 20, textAlign: "center" },
  removeButton: { padding: 8 },
  footer: { padding: 20, borderTopWidth: 1 },
  totalContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  totalLabel: { fontSize: 18, fontWeight: "600" },
  totalAmount: { fontSize: 20, fontWeight: "bold" },
  summary: { marginBottom: 20 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: "500" },
  checkoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 16, borderRadius: 12, gap: 8 },
  checkoutButtonText: { fontSize: 16, fontWeight: "600" },
  emptyCart: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyCartText: { fontSize: 20, fontWeight: "600", marginTop: 16, marginBottom: 8 },
  emptyCartSubtext: { fontSize: 16, textAlign: "center" },
});

export default CartScreen;
