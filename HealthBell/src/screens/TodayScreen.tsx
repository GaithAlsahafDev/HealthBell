// src/screens/TodayScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
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
      <View style={styles.row}>
        <View style={styles.info}>
          <MyText style={styles.name}>{item.medicineName}</MyText>
          <MyText style={styles.time}>
            {item.time} • {labelFor(item.status)}
          </MyText>
        </View>

        <View style={styles.actions}>
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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <MyText style={styles.header}>Today</MyText>
      <FlatList
        data={sorted}
        keyExtractor={it => it.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<MyText style={styles.empty}>No doses scheduled for today.</MyText>}
        contentContainerStyle={sorted.length ? undefined : styles.emptyContainer}
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

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  info: { flexShrink: 1, paddingRight: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#111827' },
  time: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
  separator: { height: 1, backgroundColor: '#e5e7eb' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { color: '#6b7280' },
});
