import React from 'react';
import { View } from 'react-native';
import MyText from '../MyText';

export default function TodayHeader({ now }: { now: Date }) {
  return (
    <View className="py-1">
      <View className="self-start rounded-full bg-gray-100 px-3 py-1.5">
        <MyText className="text-[12px] font-medium text-gray-700 tracking-wide">
          {formatDate(new Date().toISOString())} • {formatTime(now)}
        </MyText>
      </View>
    </View>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(d);
}

function formatTime(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}
