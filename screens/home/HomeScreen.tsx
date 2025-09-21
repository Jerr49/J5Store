import React, { useEffect, useRef } from "react";
import { Animated, FlatList, RefreshControl,  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchProducts } from "../../store/slices/productSlice";
import { toggleTheme } from "../../store/slices/themeSlice";
import { DarkTheme, LightTheme } from "../../constants/theme";

// Components
import HomeHeader from "./HomeHeader";
import CategorySection from "./CategorySection";
import FlashSaleSection from "./FlashSaleSection";
import FeaturedSection from "./FeaturedSection";
import ProductListSection from "./ProductListSection";
import FooterSection from "./FooterSection";

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const theme = isDarkMode ? DarkTheme.colors : LightTheme.colors;

  const productsState = useAppSelector((state) => state.products);
  const { products, featuredProducts, trendingProducts, loading, error } = productsState;

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [refreshing, setRefreshing] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState("all");

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchProducts()).finally(() => setRefreshing(false));
  };

  if (error) return <FooterSection error={error} dispatch={dispatch} theme={theme} />;

  if (loading && !refreshing) return <FooterSection loading theme={theme} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <HomeHeader
        navigation={navigation}
        scrollY={scrollY}
        isDarkMode={isDarkMode}
        toggleTheme={() => dispatch(toggleTheme())}
        cartItemsCount={cartItemsCount}
        theme={theme}
      />

      <Animated.FlatList
        data={products}
        renderItem={({ item }) => <ProductListSection product={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 40, backgroundColor: theme.background }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
        }
        ListHeaderComponent={
          <>
            <CategorySection
              navigation={navigation}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            <FlashSaleSection navigation={navigation} trendingProducts={trendingProducts} theme={theme} />
            <FeaturedSection navigation={navigation} featuredProducts={featuredProducts} theme={theme} />
          </>
        }
        ListFooterComponent={<FooterSection theme={theme} />}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
