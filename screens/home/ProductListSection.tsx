import React from "react";
import { View } from "react-native";
import ProductCard from "../../components/common/product/ProductCard";

const ProductListSection = ({ product }: any) => (
  <View style={{ flex: 1, maxWidth: "50%", marginBottom: 16 }}>
    <ProductCard product={product} />
  </View>
);

export default ProductListSection;
