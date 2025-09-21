import React from "react";
import { FlatList, TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import SectionHeader from "../../components/home/SectionHeader";

const FlashSaleSection = ({ navigation, trendingProducts, theme }: any) => {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={[styles.featuredProductCard, { backgroundColor: theme.card }]} onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}>
      <Image source={{ uri: item.image }} style={styles.featuredProductImage} />
      <View style={styles.featuredProductOverlay}>
        <Text style={[styles.featuredProductName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.featuredProductPrice, { color: theme.primary }]}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <SectionHeader title="Flash Sale" rightText="Ends in:" onRightPress={() => navigation.navigate("FlashSale")} />
      <FlatList
        data={trendingProducts.slice(0, 6)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  featuredProductCard: { width: 150, marginRight: 15, borderRadius: 12, overflow: "hidden" },
  featuredProductImage: { width: "100%", height: 120, resizeMode: "cover" },
  featuredProductOverlay: { padding: 10 },
  featuredProductName: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  featuredProductPrice: { fontSize: 16, fontWeight: "bold" },
});

export default FlashSaleSection;
