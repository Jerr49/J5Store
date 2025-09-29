import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../components/navigation/MainNavigator";
import { orders, Order } from "../../../data/mockOrdersWithItems";
import { useTheme } from "../../../constants/theme";

type OrderHistoryNavigationProp = StackNavigationProp<
  RootStackParamList,
  "OrderHistory"
>;

const OrderHistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<OrderHistoryNavigationProp>();

  const handleOrderPress = (order: Order) => {
    navigation.navigate("OrderDetails", { order });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {orders.map((order: Order) => {
          const totalPrice: number = order.items.reduce(
            (sum: number, item: Order["items"][number]) =>
              sum + item.price * item.quantity,
            0
          );
          return (
            <TouchableOpacity
              key={order.id}
              style={[styles.card, { backgroundColor: colors.card }]}
              onPress={() => handleOrderPress(order)}
            >
              <View style={{ marginBottom: 10 }}>
                <Text style={{ color: colors.text, fontWeight: "bold" }}>
                  {order.orderNumber}
                </Text>
                <Text style={{ color: colors.text }}>{order.date}</Text>
                <Text style={{ color: colors.text }}>
                  Status: {order.status}
                </Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {order.items.map((item: Order["items"][number]) => (
                  <Image
                    key={item.id}
                    source={{ uri: item.image }}
                    style={styles.thumb}
                  />
                ))}
              </ScrollView>
              <Text
                style={{
                  color: colors.text,
                  marginTop: 10,
                  fontWeight: "bold",
                }}
              >
                Total: ${totalPrice.toFixed(2)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
});

export default OrderHistoryScreen;
