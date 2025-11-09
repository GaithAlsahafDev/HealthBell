import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MyText from './MyText'; // ← استدعِ المكون

interface Props {
  name: string;
  email: string;
}

export default function ProfileCard({ name, email }: Props) {
  return (
    <View className="w-4/5 max-w-[340px] aspect-square items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 shadow-md android:elevation-3 p-5">
      <View className="mb-2.5">
        <MaterialCommunityIcons name="account-circle" size={64} color="#6b7280" />
      </View>
      <View className="items-center">
        <MyText className="text-[22x] font-bold text-gray-900">{name}</MyText>
        <MyText className="text-[16px] text-gray-500 mt-0.5">{email}</MyText>
      </View>
    </View>
  );
}
