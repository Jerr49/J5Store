// import React from 'react';
// import { View, FlatList, StyleSheet } from 'react-native';
// import ProductCard from './ProductCard';
// import { Product } from '../../../types/index';

// interface ProductListProps {
//   products: Product[];
// }

// const ProductList: React.FC<ProductListProps> = ({ products }) => {
//   const renderProduct = ({ item }: { item: Product }) => (
//     <ProductCard product={item} />
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={products}
//         renderItem={renderProduct}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         contentContainerStyle={styles.list}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   list: {
//     padding: 8,
//   },
// });

// export default ProductList;