import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import MyText from '../components/MyText';
import { useAppSelector } from '../hooks/reduxHooks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';

import TodayHeader from '../components/today-screen/TodayHeader';
import ConnectionStatusBar from '../components/today-screen/ConnectionStatusBar';
import DoseItem from '../components/today-screen/DoseItem';

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
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [lastOnline, setLastOnline] = useState<Date | null>(null);

  const { bottom } = useSafeAreaInsets();
  const containerStyle = { paddingBottom: bottom };

  useEffect(() => {
    const initial = buildDosesFromMedicines(medicines);
    setDoses(initial);
  }, [medicines]);

  useEffect(() => {
    setSorted([...doses].sort((a, b) => a.time.localeCompare(b.time)));
  }, [doses]);

  useEffect(() => {
    const update = () => setNow(new Date());
    const msToNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const timeoutId = setTimeout(() => {
      update();
      intervalId = setInterval(update, 60000);
    }, msToNextMinute);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, [now]);

  useEffect(() => {
    const handleStateChange = (state: { isConnected: boolean | null }) => {
      const connected = !!state.isConnected;
      setIsOnline(connected);
      if (connected) {
        setLastOnline(new Date());
      }
    };

    NetInfo.fetch().then(handleStateChange).catch(() => {
      setIsOnline(null);
    });

    const unsubscribe = NetInfo.addEventListener(handleStateChange);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    let changed = false;

    const updated = doses.map(d => {
      if (d.status !== 'upcoming') return d;

      const [hh, mm] = d.time.split(':').map(Number);
      const doseMinutes = hh * 60 + mm;

      if (doseMinutes < nowMinutes) {
        changed = true;
        return { ...d, status: 'missed' as const };
      }

      return d;
    });

    if (changed) {
      setDoses(updated);
    }
  }, [now, doses]);

  const setStatus = (id: string, status: 'taken' | 'missed') => {
    setDoses(prev => prev.map(d => (d.id === id ? { ...d, status } : d)));
  };

  const renderItem = ({ item }: { item: Dose }) => (
    <DoseItem item={item} onSetStatus={setStatus} />
  );

  const listContentContainerStyle = sorted.length ? undefined : { flex: 1 };

  const connectionText =
    isOnline === null
      ? 'Checking connection…'
      : isOnline
      ? 'Online – data will sync automatically when needed.'
      : lastOnline
      ? `Offline – last online ${formatDateTime(lastOnline)}`
      : 'Offline – no previous online session detected.';

  return (
    <View className="flex-1 bg-white px-4 pt-2" style={containerStyle}>
      <FlatList
        data={sorted}
        keyExtractor={it => it.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListHeaderComponent={<TodayHeader now={now} />}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <MyText className="text-gray-500">No doses scheduled for today.</MyText>
          </View>
        }
        contentContainerStyle={listContentContainerStyle}
      />

      <ConnectionStatusBar
        isOnline={isOnline}
        lastOnline={lastOnline}
        connectionText={connectionText}
      />
    </View>
  );
}

/* ---------- helpers ---------- */
function labelFor(s: 'upcoming' | 'taken' | 'missed') {
  if (s === 'taken') return 'Taken';
  if (s === 'missed') return 'Missed';
  return 'Upcoming';
}

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

function buildDosesFromMedicines(medicines: Medicine[]): Dose[] {
  const today = new Date();
  const weekdayLabel = new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(today);
  const todayStr = today.toISOString().slice(0, 10);

  return medicines.flatMap(med => {
    const everyDay = med.everyDay ?? true;
    const days: string[] | undefined = med.days;
    const courseStart: string | undefined = med.courseStart;
    const courseEnd: string | undefined = med.courseEnd;

    const inDateRange =
      (!courseStart || courseStart <= todayStr) &&
      (!courseEnd || todayStr <= courseEnd);

    if (!inDateRange) return [];

    const activeToday =
      everyDay ||
      (Array.isArray(days) && days.includes(weekdayLabel));

    if (!activeToday) return [];

    const times: string[] = med.times ?? [];

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
