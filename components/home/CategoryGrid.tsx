// components/home/CategoryGrid.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface CategoryGridProps {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
  activeCategory?: string;
}

const lightTheme = {
  card: '#fff',
  iconBackground: '#f1f5f9',
  text: '#374151',
  subText: '#9ca3af',
};

const darkTheme = {
  card: '#1f2937',
  iconBackground: '#374151',
  text: '#e5e7eb',
  subText: '#9ca3af',
};

const CategoryGrid = ({ categories, onCategoryPress }: CategoryGridProps) => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={[styles.categoryItem, { backgroundColor: theme.card }]}
      onPress={() => onCategoryPress(item)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: theme.iconBackground }]}>
        <Feather name={item.icon as any} size={24} color="#667eea" />
      </View>
      <Text style={[styles.categoryName, { color: theme.text }]} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={[styles.categoryCount, { color: theme.subText }]}>
        {item.count} items
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderCategory}
      keyExtractor={(item) => item.id}
      numColumns={3}
      scrollEnabled={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: '30%',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 10,
  },
});

export default CategoryGrid;
