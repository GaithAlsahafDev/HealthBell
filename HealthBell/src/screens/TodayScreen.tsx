// src/screens/TodayScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import MyText from '../components/MyText';
import { useAppSelector } from '../hooks/reduxHooks';

type Dose = {
  id: string;
  medicineName: string;
  time: string;
  status: 'upcoming' | 'taken' | 'missed';
};

export default function TodayScreen() {
  const medicines = useAppSelector(s => s.medicines) as Medicine[];

  const [doses, setDoses] = useState<Dose[]>([]);
  const [sorted, setSorted] = useState<Dose[]>([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const initial = buildDosesFromMedicines(medicines);
    setDoses(initial);
  }, [medicines]);

  useEffect(() => {
    setSorted([...doses].sort((a, b) => a.time.localeCompare(b.time)));
  }, [doses]);

  // ← إضافة: تحديث الوقت كل دقيقة بدقة على رأس الدقيقة
  useEffect(() => {
    const update = () => setNow(new Date());
    const msToNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    const timeoutId = setTimeout(() => {
      update();
      const intervalId = setInterval(update, 60000);
      // حفظ interval في closure لتصفيته مع return
      (update as any)._iid = intervalId;
    }, msToNextMinute);

    return () => {
      clearTimeout(timeoutId);
      if ((update as any)._iid) clearInterval((update as any)._iid);
    };
  }, [now]);

  const setStatus = (id: string, status: 'taken' | 'missed') => {
    setDoses(prev => prev.map(d => (d.id === id ? { ...d, status } : d)));
  };

  const renderItem = ({ item }: { item: Dose }) => {
    const isTaken = item.status === 'taken';
    const isMissed = item.status === 'missed';

    return (
      <View className="rounded-2xl border border-gray-200 bg-white px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 shrink pr-3">
            <View
              className={`h-2.5 w-2.5 rounded-full ${
                isTaken ? 'bg-green-500' : isMissed ? 'bg-red-500' : 'bg-amber-400'
              }`}
            />
            <View className="shrink">
              <MyText className="text-[17px] font-semibold text-gray-900">{item.medicineName}</MyText>
              <View className="flex-row items-center mt-0.5">
                <MyText className="text-[12px] text-gray-500">{item.time}</MyText>
                <View
                  className={`ml-2 px-2 py-0.5 rounded-full ${
                    isTaken ? 'bg-green-100' : isMissed ? 'bg-red-100' : 'bg-amber-100'
                  }`}
                >
                  <MyText
                    className={`text-[11px] font-medium ${
                      isTaken ? 'text-green-700' : isMissed ? 'text-red-700' : 'text-amber-700'
                    }`}
                  >
                    {labelFor(item.status)}
                  </MyText>
                </View>
              </View>
            </View>
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
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-2" edges={[]}>
      <FlatList
        data={sorted}
        keyExtractor={it => it.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={
          <View className="py-1">
            <View className="self-start rounded-full bg-gray-100 px-3 py-1.5">
              <MyText className="text-[12px] font-medium text-gray-700 tracking-wide">
                {formatDate(new Date().toISOString())} • {formatTime(now)}
              </MyText>
            </View>
          </View>
        }
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

function buildDosesFromMedicines(medicines: Medicine[]): Dose[] {
  const today = new Date();
  const weekdayLabel = new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(today); // Mon, Tue, ...
  const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

  return medicines.flatMap(med => {
    const everyDay = (med as any).everyDay ?? true;
    const days: string[] | undefined = (med as any).days;
    const courseStart: string | undefined = (med as any).courseStart;
    const courseEnd: string | undefined = (med as any).courseEnd;

    const inDateRange =
      (!courseStart || courseStart <= todayStr) &&
      (!courseEnd || todayStr <= courseEnd);

    if (!inDateRange) return [];

    const activeToday =
      everyDay ||
      (Array.isArray(days) && days.includes(weekdayLabel));

    if (!activeToday) return [];

    const times: string[] = (med as any).times ?? [];

    if (!times.length) {
      return [];
    }

    return times.map(time => ({
      id: `${med.id}_${time}`,
      medicineName: med.name,
      time,
      status: 'upcoming' as const,
    }));
  });
}
