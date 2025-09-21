import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from 'expo-image';
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { Testimonial } from "../types";

interface TestimonialItemProps {
  testimonial: Testimonial;
}

const TestimonialItem: React.FC<TestimonialItemProps> = ({ testimonial }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <View style={styles.testimonialItem}>
      <View style={styles.testimonialContent}>
        <FontAwesome5 
          name="quote-left" 
          size={24} 
          color="#e5e7eb" 
          accessibilityLabel="Quote icon"
        />
        <Text style={styles.testimonialText}>
          {testimonial.text}
        </Text>
        <View style={styles.testimonialAuthor}>
          <Image
            source={{ uri: imageError ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' : testimonial.image }}
            style={[styles.authorImage, !imageLoaded && styles.hidden]}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            transition={1000}
            accessibilityLabel={`Photo of ${testimonial.author}`}
            contentFit="cover" // This is a prop, not a style
          />
          {!imageLoaded && (
            <View style={[styles.skeleton, styles.authorSkeleton]}>
              <Feather name="user" size={20} color="#e5e7eb" />
            </View>
          )}
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{testimonial.author}</Text>
            <Text style={styles.authorTitle}>{testimonial.title}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  testimonialItem: {
    width: 335, // Adjust based on your screen width
    paddingHorizontal: 15,
  },
  testimonialContent: {
    backgroundColor: "#f8fafc",
    padding: 25,
    borderRadius: 15,
    position: "relative",
  },
  testimonialText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4b5563",
    fontStyle: "italic",
    marginVertical: 15,
  },
  testimonialAuthor: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    // Remove contentFit from here - it's a prop, not a style
  },
  authorInfo: {
    flexDirection: "column",
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  authorTitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  hidden: {
    opacity: 0,
  },
  skeleton: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
});

export default TestimonialItem;