import React from "react";
import { FlatList, View } from "react-native";
import SectionHeader from "../../components/home/SectionHeader";
import ProductCard from "../../components/common/product/ProductCard";

const FeaturedSection = ({ navigation, featuredProducts, theme }: any) => {
  return (
    <>
      <SectionHeader title="Featured Products" rightText="View all" onRightPress={() => navigation.navigate("Featured")} />
      <FlatList
        data={featuredProducts.slice(0, 4)}
        renderItem={({ item }) => (
          <View style={{ flex: 1, maxWidth: "50%", marginBottom: 16 }}>
            <ProductCard product={item} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </>
  );
};

export default FeaturedSection;
