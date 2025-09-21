import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../constants/theme";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../components/navigation/MainNavigator";
import { Order } from "../../data/mockOrdersWithItems";

// Types
type OrderDetailsRouteProp = RouteProp<RootStackParamList, "OrderDetails">;
type OrderDetailsNavigationProp = StackNavigationProp<RootStackParamList, "OrderDetails">;

const OrderDetailsScreen: React.FC = () => {
  const { colors } = useTheme();
  const route = useRoute<OrderDetailsRouteProp>();
  const navigation = useNavigation<OrderDetailsNavigationProp>();

  if (!route.params?.order) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.text }}>No order data available.</Text>
      </SafeAreaView>
    );
  }

  const order: Order = route.params.order;

  const totalPrice: number = order.items.reduce(
    (sum: number, item: Order["items"][number]) => sum + item.price * item.quantity,
    0
  );

  const getStatusColor = (status: Order["status"]): string => {
    switch (status) {
      case "Pending": return "orange";
      case "Shipped": return "blue";
      case "Delivered": return "green";
      case "Cancelled": return "red";
      default: return "gray";
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.accent, fontWeight: "bold", marginBottom: 20 }}>← Back</Text>
        </TouchableOpacity>

        {/* Order Header */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.orderNumber, { color: colors.text }]}>Order: {order.orderNumber}</Text>
          <Text style={{ color: colors.text }}>Date: {order.date}</Text>
          <Text style={{ color: getStatusColor(order.status), fontWeight: "bold" }}>
            Status: {order.status}
          </Text>
        </View>

        {/* Shipping Info */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Shipping Info</Text>
          <Text style={{ color: colors.text }}>{order.shipping.name}</Text>
          <Text style={{ color: colors.text }}>{order.shipping.address}</Text>
          <Text style={{ color: colors.text }}>
            {order.shipping.city}, {order.shipping.country} {order.shipping.zip}
          </Text>
        </View>

        {/* Items List */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Items</Text>
          {order.items.map((item: Order["items"][number]) => (
            <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.background }]}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: colors.text, fontWeight: "bold" }}>{item.name}</Text>
                <Text style={{ color: colors.text }}>Quantity: {item.quantity}</Text>
                <Text style={{ color: colors.text }}>Price: ${item.price.toFixed(2)}</Text>
              </View>
              <Text style={{ color: colors.text, fontWeight: "bold" }}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Total Price */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Total</Text>
          <Text style={{ color: colors.text, fontWeight: "bold", fontSize: 18 }}>
            ${totalPrice.toFixed(2)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  orderNumber: { fontWeight: "bold", fontSize: 18, marginBottom: 5 },
  sectionTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 12 },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: { width: 60, height: 60, borderRadius: 8 },
});

export default OrderDetailsScreen;
