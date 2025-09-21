import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from 'expo-image';
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { Product } from "../types";



interface TrendingItemProps {
  item: Product;
  onPress: (item: Product) => void;
}

const TrendingItem: React.FC<TrendingItemProps> = ({ item, onPress }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(item);
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={handlePress}
      accessibilityLabel={`${item.name}, Price: $${item.price}, Rating: ${item.rating} stars`}
      accessibilityRole="button"
    >
      <View style={styles.trendingItem}>
        <Image
          source={{ uri: imageError ? 'https://images.unsplash.com/photo-1566206091558-7f218b696731' : item.image }}
          style={[styles.trendingImage, !imageLoaded && styles.hidden]}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          transition={1000}
          placeholder={require('../../assets/images/placeholder-image.png')}
          accessibilityLabel={item.name}
          contentFit="cover" // This is a prop, not a style
        />
        {!imageLoaded && (
          <View style={styles.skeleton}>
            <Feather name="image" size={32} color="#e5e7eb" />
          </View>
        )}
        <View style={styles.trendingInfo}>
          <Text style={styles.trendingText} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.trendingPrice}>
            ${item.price}
          </Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name="star"
                size={14}
                color={star <= item.rating ? "#fbbf24" : "#d1d5db"}
                accessibilityLabel={star <= item.rating ? "Filled star" : "Empty star"}
              />
            ))}
            <Text style={styles.ratingText}>({item.reviews})</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  trendingItem: {
    width: 200,
    marginRight: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  trendingImage: {
    width: "100%",
    height: 150,
    // Remove contentFit from here - it's a prop, not a style
  },
  trendingInfo: {
    padding: 15,
  },
  trendingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 5,
  },
  trendingPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b82f6",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 5,
  },
  hidden: {
    opacity: 0,
  },
  skeleton: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
});

export default TrendingItem;