import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useTheme } from "../../constants/theme";
import {
  removeMethod,
  setDefaultMethod,
  PaymentMethod,
} from "../../store/slices/paymentSlice";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import Animated, { Layout, FadeIn, FadeOut } from "react-native-reanimated";
import { RootStackParamList } from "../../components/navigation/MainNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const PaymentMethodsScreen: React.FC = () => {
  const { colors, shadows } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const methods = useSelector((state: RootState) => state.payment.methods);

  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

  const handleRemove = (id: string) => {
    Alert.alert(
      "Remove Payment Method",
      "Are you sure you want to remove this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            dispatch(removeMethod(id));
            swipeableRefs.current.get(id)?.close();
          },
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => dispatch(setDefaultMethod(id));

  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
        return <FontAwesome5 name="cc-visa" size={24} color="#1A1F71" />;
      case "mastercard":
        return <FontAwesome5 name="cc-mastercard" size={24} color="#EB001B" />;
      case "amex":
        return <FontAwesome5 name="cc-amex" size={24} color="#006FCF" />;
      case "discover":
        return <FontAwesome5 name="cc-discover" size={24} color="#FF6000" />;
      case "paypal":
        return <FontAwesome5 name="cc-paypal" size={24} color="#003087" />;
      case "applepay":
        return <FontAwesome5 name="apple-pay" size={24} color="#000" />;
      default:
        return (
          <FontAwesome5 name="credit-card" size={22} color={colors.text} />
        );
    }
  };

  const renderItem = ({ item }: { item: PaymentMethod }) => (
    <Swipeable
      ref={(ref) => {
        if (ref) swipeableRefs.current.set(item.id, ref);
      }}
      renderRightActions={() => (
        <RectButton
          style={[styles.swipeDelete, { backgroundColor: "#ef4444" }]}
          onPress={() => handleRemove(item.id)}
        >
          <Feather name="trash-2" size={24} color="#fff" />
        </RectButton>
      )}
      overshootRight={false}
      friction={2}
    >
      <Animated.View
        layout={Layout.springify()}
        style={[
          styles.methodCard,
          {
            backgroundColor: colors.card,
            borderColor: item.isDefault ? colors.accent : "transparent",
            borderWidth: item.isDefault ? 1.5 : 0,
            ...(Platform.OS === "ios" ? shadows.medium : {}),
          },
        ]}
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(300)}
      >
        <View style={styles.methodLeft}>
          {getCardIcon(item.brand || item.type)}
          <View style={{ marginLeft: 15 }}>
            <Text style={[styles.methodName, { color: colors.text }]}>
              {item.name}
            </Text>
            {item.number && (
              <Text
                style={[styles.methodNumber, { color: colors.secondaryText }]}
              >
                •••• •••• •••• {item.number}
              </Text>
            )}
            {item.isDefault && (
              <View
                style={[
                  styles.defaultBadge,
                  { backgroundColor: colors.accent + "20" },
                ]}
              >
                <Text
                  style={{
                    color: colors.accent,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Default
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.methodRight}>
          {!item.isDefault && (
            <TouchableOpacity
              style={[styles.defaultButton, { borderColor: colors.accent }]}
              onPress={() => handleSetDefault(item.id)}
            >
              <Text
                style={{
                  color: colors.accent,
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                Set Default
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Swipeable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* <StatusBar barStyle="dark-content" backgroundColor={colors.background} /> */}
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <Text style={[styles.title, { color: colors.text }]}>
          Payment Methods
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Manage your payment methods
        </Text>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.accent }]}
          onPress={() => navigation.navigate("AddPaymentMethod")}
        >
          <Feather name="plus" size={20} color="#fff" />
          <Text style={styles.addText}>Add Payment Method</Text>
        </TouchableOpacity>

        {methods.length > 0 ? (
          <FlatList
            data={methods}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="credit-card-off-outline"
              size={64}
              color={colors.secondaryText}
            />
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              No payment methods added yet
            </Text>
            <Text
              style={[styles.emptySubtext, { color: colors.secondaryText }]}
            >
              Add a payment method to get started
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 16, marginBottom: 20 },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  addText: { color: "#fff", fontWeight: "700", marginLeft: 8, fontSize: 16 },
  methodCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  methodLeft: { flexDirection: "row", alignItems: "center" },
  methodName: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  methodNumber: { fontSize: 14, marginBottom: 4 },
  methodRight: { flexDirection: "row", alignItems: "center" },
  defaultButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  defaultBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  swipeDelete: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 12,
    marginBottom: 15,
    marginLeft: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: { fontSize: 14, textAlign: "center", paddingHorizontal: 40 },
});

export default PaymentMethodsScreen;
