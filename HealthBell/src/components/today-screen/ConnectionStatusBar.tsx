import React from 'react';
import { View } from 'react-native';
import MyText from '../MyText';

export default function ConnectionStatusBar({
  isOnline,
  lastOnline,
  connectionText,
}: {
  isOnline: boolean | null;
  lastOnline: Date | null;
  connectionText: string;
}) {
  return (
    <View className="mt-2 mb-1">
      <View
        className={`flex-row items-center justify-center rounded-full px-3 py-1.5 ${
          isOnline ? 'bg-green-50' : 'bg-amber-50'
        }`}
      >
        <View
          className={`h-2 w-2 rounded-full mr-2 ${
            isOnline ? 'bg-green-500' : 'bg-amber-500'
          }`}
        />
        <MyText
          className={`text-[11px] font-medium ${
            isOnline ? 'text-green-700' : 'text-amber-700'
          }`}
        >
          {connectionText}
        </MyText>
      </View>
    </View>
  );
}
