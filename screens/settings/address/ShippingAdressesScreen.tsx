import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  removeAddress,
  setDefaultAddress,
  selectAddress,
} from "../../../store/slices/shippingSlice";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../constants/theme";
import AddressCard from "../../../components/common/AddressCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_MAX_HEIGHT = 100;
const HEADER_MIN_HEIGHT = 60;
const TITLE_MAX_SIZE = 24;
const TITLE_MIN_SIZE = 18;
const FAB_MAX_WIDTH = 160;
const FAB_MIN_WIDTH = 56;

const ShippingAddressesScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const addresses = useSelector((state: RootState) => state.shipping.addresses);
  const selectedAddress = useSelector(
    (state: RootState) => state.shipping.selectedAddress
  );
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;
  const fabAnim = useRef(new Animated.Value(1)).current; // 1=visible, 0=hidden

  // Sort addresses so default one is always at top
  const sortedAddresses = [...addresses].sort((a, b) => {
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;
    return 0;
  });

  const handleRemove = (id: string) => {
    Alert.alert("Remove Address", "Are you sure you want to delete this address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(removeAddress(id)),
      },
    ]);
  };

  const handleSetDefault = (id: string) => {
    dispatch(setDefaultAddress(id));
    Alert.alert("Default Address", "This address has been set as your default.");
  };

  const handleSelectAddress = (id: string) => {
    dispatch(selectAddress(id));
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        Animated.timing(fabAnim, {
          toValue: offsetY > 20 ? 0 : 1,
          duration: 200,
          useNativeDriver: false,
        }).start();
      },
    }
  );

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const titleSize = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [TITLE_MAX_SIZE, TITLE_MIN_SIZE],
    extrapolate: "clamp",
  });

  const fabWidth = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [FAB_MIN_WIDTH, FAB_MAX_WIDTH],
  });

  const fabOpacity = fabAnim;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            height: headerHeight,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.headerText,
            { color: "whitesmoke", fontSize: titleSize },
          ]}
        >
          Shipping Addresses
        </Animated.Text>
      </Animated.View>

      <Animated.FlatList
        data={sortedAddresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AddressCard
            address={item}
            isSelected={selectedAddress?.id === item.id} // highlight selected one
            onPress={() => handleSelectAddress(item.id)} // select when tapped
            onEdit={() => navigation.navigate("EditAddress", { address: item })}
            onDelete={() => handleRemove(item.id)}
            onPressDefault={() => handleSetDefault(item.id)}
          />
        )}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: HEADER_MAX_HEIGHT + 16,
          paddingHorizontal: 16,
        }}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        ListEmptyComponent={
          <View style={{ marginTop: 100, alignItems: "center" }}>
            <Ionicons name="home-outline" size={50} color={colors.secondaryText} />
            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                color: colors.secondaryText,
              }}
            >
              No addresses saved yet
            </Text>
          </View>
        }
      />

      {/* Animated FAB */}
      <Animated.View
        style={[
          styles.fab,
          {
            width: fabWidth,
            opacity: fabOpacity,
            backgroundColor: colors.primary,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fabContent}
          onPress={() => navigation.navigate("AddAddress")}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Animated.Text style={styles.fabText}>Add Address</Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  headerText: { fontWeight: "700" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    height: 56,
    borderRadius: 28,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    overflow: "hidden",
    justifyContent: "center",
  },
  fabContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  fabText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ShippingAddressesScreen;
