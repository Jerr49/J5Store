// components/common/SearchBar.tsx
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder: string;
  onFocus: () => void;
  style?: any;
}

const SearchBar = ({ placeholder, onFocus, style }: SearchBarProps) => {
  return (
    <TouchableOpacity onPress={onFocus} style={[styles.container, style]}>
      <Feather name="search" size={20} color="#9ca3af" />
      <Text style={styles.placeholder}>{placeholder}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 12,
  },
  placeholder: {
    marginLeft: 12,
    color: '#9ca3af',
    fontSize: 16,
  },
});

export default SearchBar;