import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Animated, StyleSheet } from "react-native";
import TrendingItem from "./TrendingItem";
import { Product } from "../types";

interface TrendingSectionProps {
  trendingOpacity: Animated.AnimatedInterpolation<number>;
  trendingTranslateX: Animated.AnimatedInterpolation<number>;
  trendingProducts: Product[] | null;
  trendingLoading: boolean;
  onLayout: () => void;
  onViewAll: () => void;
  onItemPress: (item: Product) => void;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({
  trendingOpacity,
  trendingTranslateX,
  trendingProducts,
  trendingLoading,
  onLayout,
  onViewAll,
  onItemPress
}) => {
  return (
    <Animated.View
      style={[
        styles.trendingSection,
        {
          opacity: trendingOpacity,
          transform: [{ translateX: trendingTranslateX }],
        },
      ]}
      onLayout={onLayout}
      accessibilityLabel="Trending Now products"
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <TouchableOpacity
          onPress={onViewAll}
          accessibilityLabel="View all trending products"
          accessibilityRole="button"
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      
      {trendingLoading ? (
        <View style={styles.loadingContainer}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.skeletonCard}>
              <View style={[styles.skeleton, styles.trendingSkeleton]} />
              <View style={styles.skeletonText} />
              <View style={styles.skeletonTextShort} />
            </View>
          ))}
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.trendingScroll}
          decelerationRate="fast"
          snapToInterval={220}
          snapToAlignment="start"
        >
          {trendingProducts?.map((item: Product) => (
            <TrendingItem 
              key={item.id} 
              item={item} 
              onPress={onItemPress}
            />
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  trendingSection: {
    padding: 30,
    backgroundColor: "#f8fafc",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
    color: "#1f2937",
  },
  viewAllText: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  loadingContainer: {
    flexDirection: 'row',
    marginHorizontal: -30,
  },
  skeletonCard: {
    width: 200,
    marginRight: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    padding: 15,
  },
  skeleton: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingSkeleton: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  skeletonText: {
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
    width: '80%',
  },
  skeletonTextShort: {
    height: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
    width: '60%',
  },
  trendingScroll: {
    marginHorizontal: -30,
  },
});

export default TrendingSection;