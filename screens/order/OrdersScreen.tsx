import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  Image,
} from "react-native";
import { useTheme } from "../../constants/theme"; 

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  total: number;
  estimatedDelivery?: string;
  items: Product[];
}

const OrdersScreen = () => {
  const { colors } = useTheme(); 
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "All" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
  >("All");

  const orders: Order[] = [
    {
      id: "1",
      status: "Delivered",
      date: "2023-05-15",
      total: 129.99,
      estimatedDelivery: "2023-05-20",
      items: [
        {
          id: "p1",
          name: "Wireless Headphones",
          image: "https://via.placeholder.com/100",
          price: 59.99,
          quantity: 1,
        },
        {
          id: "p2",
          name: "Bluetooth Speaker",
          image: "https://via.placeholder.com/100",
          price: 70.0,
          quantity: 1,
        },
      ],
    },
    {
      id: "2",
      status: "Processing",
      date: "2023-05-10",
      total: 89.99,
      estimatedDelivery: "2023-05-22",
      items: [
        {
          id: "p3",
          name: "Smart Watch",
          image: "https://via.placeholder.com/100",
          price: 89.99,
          quantity: 1,
        },
      ],
    },
    {
      id: "3",
      status: "Shipped",
      date: "2023-05-05",
      total: 199.99,
      estimatedDelivery: "2023-05-18",
      items: [
        {
          id: "p4",
          name: "Gaming Mouse",
          image: "https://via.placeholder.com/100",
          price: 49.99,
          quantity: 2,
        },
        {
          id: "p5",
          name: "Mechanical Keyboard",
          image: "https://via.placeholder.com/100",
          price: 100.01,
          quantity: 1,
        },
      ],
    },
  ];

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  const toggleExpand = (id: string) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const isExpanded = expandedOrderId === item.id;
    return (
      <View
        style={[
          styles.orderItem,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {/* Header */}
        <TouchableOpacity
          style={styles.orderHeader}
          onPress={() => toggleExpand(item.id)}
        >
          <View>
            <Text style={[styles.orderId, { color: colors.text }]}>
              Order # {item.id}
            </Text>
            <Text style={[styles.orderDate, { color: colors.secondaryText }]}>
              Placed on {item.date}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <Text
              style={[
                styles.orderStatus,
                item.status === "Delivered"
                  ? { color: "#10b981" }
                  : item.status === "Shipped"
                  ? { color: "#f59e0b" }
                  : item.status === "Processing"
                  ? { color: colors.primary }
                  : { color: "#ef4444" },
              ]}
            >
              {item.status}
            </Text>
            <Text style={[styles.chevron, { color: colors.secondaryText }]}>
              {isExpanded ? "▲" : "▼"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Expandable Section */}
        {isExpanded && (
          <View style={styles.orderDetails}>
            {/* Progress Tracker */}
            {item.status !== "Cancelled" && (
              <ProgressTracker status={item.status} />
            )}

            {/* Estimated Delivery */}
            {item.estimatedDelivery && (
              <Text style={[styles.delivery, { color: colors.text }]}>
                Estimated Delivery: {item.estimatedDelivery}
              </Text>
            )}

            {/* Products */}
            {item.items.map((product) => (
              <View key={product.id} style={styles.productRow}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImg}
                />
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: colors.text }]}>
                    {product.name}
                  </Text>
                  <Text
                    style={[styles.productMeta, { color: colors.secondaryText }]}
                  >
                    Qty: {product.quantity} | ${product.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}

            {/* Order Total */}
            <Text style={[styles.orderTotal, { color: colors.text }]}>
              Total: ${item.total.toFixed(2)}
            </Text>

            {/* Actions */}
            <View style={styles.actions}>
              {item.status === "Delivered" && (
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.actionText}>Leave Review</Text>
                </TouchableOpacity>
              )}
              {item.status === "Processing" && (
                <TouchableOpacity style={styles.actionBtnCancel}>
                  <Text style={styles.actionText}>Cancel Order</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.actionText}>Download Invoice</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Your Orders</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === tab ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? "#fff" : colors.text },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            No orders found
          </Text>
          <TouchableOpacity
            style={[styles.shopNowBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.shopNowText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const ProgressTracker = ({ status }: { status: Order["status"] }) => {
  const { colors } = useTheme();
  const steps = ["Processing", "Shipped", "Out for Delivery", "Delivered"];
  const currentStep = steps.indexOf(
    status === "Delivered" ? "Delivered" : status
  );

  return (
    <View style={styles.progressRow}>
      {steps.map((step, index) => (
        <View key={step} style={styles.progressStep}>
          <View
            style={[
              styles.progressCircle,
              index <= currentStep
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.border },
            ]}
          />
          <Text
            style={
              index <= currentStep
                ? [styles.progressTextActive, { color: colors.primary }]
                : [styles.progressText, { color: colors.secondaryText }]
            }
          >
            {step}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tabText: { fontSize: 14 },
  ordersList: { paddingHorizontal: 15 },
  orderItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
  },
  orderHeader: { flexDirection: "row", justifyContent: "space-between" },
  orderId: { fontSize: 16, fontWeight: "500" },
  orderDate: { fontSize: 14 },
  statusContainer: { alignItems: "flex-end" },
  orderStatus: { fontSize: 14, fontWeight: "600" },
  chevron: { fontSize: 12, marginTop: 4 },
  orderDetails: { marginTop: 12 },
  delivery: { fontSize: 14, marginBottom: 8 },
  productRow: { flexDirection: "row", marginBottom: 10 },
  productImg: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  productInfo: { flex: 1, justifyContent: "center" },
  productName: { fontSize: 15, fontWeight: "500" },
  productMeta: { fontSize: 13 },
  orderTotal: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
  actions: { flexDirection: "row", marginTop: 12, gap: 10 },
  actionBtn: { padding: 8, borderRadius: 6 },
  actionBtnCancel: { padding: 8, backgroundColor: "#ef4444", borderRadius: 6 },
  actionText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, marginBottom: 10 },
  shopNowBtn: { padding: 10, borderRadius: 6 },
  shopNowText: { color: "#fff", fontWeight: "600" },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  progressStep: { alignItems: "center", flex: 1 },
  progressCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  progressText: { fontSize: 12 },
  progressTextActive: { fontSize: 12, fontWeight: "600" },
});

export default OrdersScreen;
