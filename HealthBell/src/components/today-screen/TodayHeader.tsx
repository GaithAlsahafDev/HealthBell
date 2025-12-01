import React from 'react';
import { View } from 'react-native';
import MyText from '../MyText';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TodayHeader({ now }: { now: Date }) {
  return (
    <View className="py-1">
      <View
        className="
          self-start flex-row items-center gap-2
          rounded-xl bg-gray-100 px-4 py-2
          border border-gray-200
          android:elevation-1
          ios:shadow ios:shadow-black/10 ios:shadow-opacity-[0.08]
          ios:shadow-offset-[0,2] ios:shadow-radius-[4]
        "
      >
        <MaterialCommunityIcons name="calendar" size={16} color="#4B5563" />
        <MyText className="text-[13px] font-semibold text-gray-800 tracking-wide">
          {formatFullDate(now)} — {formatTime(now)}
        </MyText>
      </View>
    </View>
  );
}

function formatFullDate(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

function formatTime(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
