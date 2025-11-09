import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
}

export default function Button({ label, onPress, variant = 'primary' }: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.base, isPrimary ? styles.primary : styles.outline]}
      activeOpacity={0.7}
    >
      <Text style={isPrimary ? styles.textPrimary : styles.textOutline}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  primary: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  outline: {
    backgroundColor: '#fff',
    borderColor: '#d1d5db',
  },
  textPrimary: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Poppins-Black',
  },
  textOutline: {
    color: '#374151',
    fontWeight: '600',
    fontFamily: 'Poppins-Black',
  },
});
