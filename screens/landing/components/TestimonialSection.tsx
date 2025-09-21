import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import TestimonialItem from "./TestimonialItem";
import { Testimonial } from "../types";

const { width } = Dimensions.get("window");

interface TestimonialsSectionProps {
  testimonials: Testimonial[] | null;
  testimonialsLoading: boolean;
  onLayout: () => void;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  testimonialsLoading,
  onLayout
}) => {
  return (
    <View 
      style={styles.testimonialSection}
      onLayout={onLayout}
      accessibilityLabel="Customer testimonials"
    >
      <Text style={styles.sectionTitle}>What Our Customers Say</Text>
      
      {testimonialsLoading ? (
        <View style={styles.loadingContainer}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.skeletonTestimonial}>
              <View style={styles.skeletonTextLong} />
              <View style={styles.skeletonTextMedium} />
              <View style={styles.testimonialAuthor}>
                <View style={[styles.skeleton, styles.authorSkeleton]} />
                <View style={styles.skeletonTextShort} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.testimonialScroll}
        >
          {testimonials?.map((testimonial: Testimonial) => (
            <TestimonialItem 
              key={testimonial.id} 
              testimonial={testimonial} 
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  testimonialSection: {
    padding: 30,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
    color: "#1f2937",
  },
  testimonialScroll: {
    marginHorizontal: -30,
  },
  loadingContainer: {
    flexDirection: 'row',
    marginHorizontal: -30,
  },
  skeleton: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonTestimonial: {
    width: width - 90,
    padding: 15,
    backgroundColor: "#f8fafc",
    borderRadius: 15,
    marginRight: 15,
  },
  skeletonTextLong: {
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 12,
    width: '100%',
  },
  skeletonTextMedium: {
    height: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
    width: '40%',
  },
  skeletonTextShort: {
    height: 14,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
    width: '60%',
  },
  testimonialAuthor: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
});

export default TestimonialsSection;