import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MyText from './MyText';

type Props = {
  name: string;
  dosageMg?: number;
  frequency?: string;
  hint?: string;
  onPress?: () => void;
};

export default function MedicineCard({ name, dosageMg, frequency, hint, onPress }: Props) {
  const subtitle =
    `${dosageMg ? `${dosageMg}mg` : '—'} · ${frequency ?? '—'}${hint ? ` · ${hint}` : ''}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={Platform.OS === 'ios' ? 0.7 : 0.8}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`Open ${name} details`}
    >
      <View style={styles.content}>
        <MyText style={styles.name}>{name}</MyText>
        <MyText style={styles.sub}>{subtitle}</MyText>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={22} color="#6b7280" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  content: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#111827' },
  sub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
});
