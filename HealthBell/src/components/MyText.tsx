import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

export default function MyText({ style, children, ...rest }: TextProps) {
  return (
    <Text {...rest} style={[styles.base, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: 'Poppins-Regular', // حمّل الخط عبر expo-font إن كنت تستعمله
    color: '#111827',
  },
});
