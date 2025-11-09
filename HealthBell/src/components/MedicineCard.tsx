import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
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
      className="flex-row items-center gap-3 p-[14px] rounded-2xl bg-white shadow-md android:elevation-2"
      accessibilityRole="button"
      accessibilityLabel={`Open ${name} details`}
    >
      <View className="flex-1">
        <MyText className="text-[16px] font-semibold text-gray-900">{name}</MyText>
        <MyText className="text-[12px] text-gray-500 mt-0.5">{subtitle}</MyText>
      </View>

      <MaterialCommunityIcons name="chevron-right" size={22} color="#6b7280" />
    </TouchableOpacity>
  );
}
