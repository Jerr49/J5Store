// components/home/SectionHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface SectionHeaderProps {
  title: string;
  rightText?: string;
  countdown?: number;
  onRightPress?: () => void;
}

const lightTheme = {
  background: '#f9fafb',
  text: '#1f2937',
  accent: '#667eea',
};

const darkTheme = {
  background: '#111827',
  text: '#f3f4f6',
  accent: '#818cf8',
};

const SectionHeader = ({ title, rightText, onRightPress }: SectionHeaderProps) => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

      {rightText && (
        <TouchableOpacity style={styles.rightContainer} onPress={onRightPress}>
          <Text style={[styles.rightText, { color: theme.accent }]}>{rightText}</Text>
          <Feather name="chevron-right" size={16} color={theme.accent} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});

export default SectionHeader;
