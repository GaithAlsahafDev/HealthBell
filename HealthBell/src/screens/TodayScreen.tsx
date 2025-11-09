// src/screens/TodayScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import MyText from '../components/MyText';

// JSON محلي لبيانات اليوم
const todayData: {
  date: string;
  doses: { id: string; medicineName: string; time: string; status: 'upcoming' | 'taken' | 'missed' }[];
} = require('../data/today.json');

export default function TodayScreen() {
  const [doses, setDoses] = useState(todayData.doses);
  const [sorted, setSorted] = useState(doses);

  useEffect(() => {
    setSorted([...doses].sort((a, b) => a.time.localeCompare(b.time)));
  }, [doses]);

  const setStatus = (id: string, status: 'taken' | 'missed') => {
    setDoses(prev => prev.map(d => (d.id === id ? { ...d, status } : d)));
  };

  const renderItem = ({ item }: { item: typeof doses[number] }) => {
    const isTaken = item.status === 'taken';
    const isMissed = item.status === 'missed';

    return (
      <View className="flex-row items-center justify-between py-[10px]">
        <View className="shrink pr-3">
          <MyText className="text-[16px] font-semibold text-gray-900">{item.medicineName}</MyText>
          <MyText className="text-[13px] text-gray-500 mt-0.5">
            {item.time} • {labelFor(item.status)}
          </MyText>
        </View>

        <View className="flex-row gap-2">
          <Button
            label="Taken"
            variant="primary"
            onPress={() => setStatus(item.id, 'taken')}
            // disabled={isTaken}
          />
          <Button
            label="Missed"
            variant="outline"
            onPress={() => setStatus(item.id, 'missed')}
            // disabled={isMissed}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4" edges={[]}>
      <FlatList
        data={sorted}
        keyExtractor={it => it.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-px bg-gray-200" />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <MyText className="text-gray-500">No doses scheduled for today.</MyText>
          </View>
        }
        // إبقاء التوسيط العمودي عند عدم وجود عناصر
        contentContainerStyle={sorted.length ? undefined : { flex: 1 }}
      />
    </SafeAreaView>
  );
}

/* ---------- helpers ---------- */
function labelFor(s: 'upcoming' | 'taken' | 'missed') {
  if (s === 'taken') return 'Taken';
  if (s === 'missed') return 'Missed';
  return 'Upcoming';
}
