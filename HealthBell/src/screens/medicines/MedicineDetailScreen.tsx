// src/screens/medicines/MedicineDetailScreen.tsx
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { MedicinesStackNavProps } from '../../navigation/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../../components/Button';
import MyText from '../../components/MyText';

// قراءة JSON والبحث بالـ id
const { medicines } = require('../../data/medicines.json') as {
  medicines: {
    id: string;
    name: string;
    dosageMg?: number;
    form?: string;
    doseText?: string;
    times?: string[];
    instructions?: 'before_food' | 'after_food' | 'with_water' | string;
    courseStart?: string;
    courseEnd?: string;
    notes?: string;
  }[];
};

const MedicineDetailScreen = () => {
  const navigation = useNavigation<MedicinesStackNavProps<'MedicineDetail'>['navigation']>();
  const route = useRoute<MedicinesStackNavProps<'MedicineDetail'>['route']>();
  const data = route.params?.data;

  const med = useMemo(() => medicines.find(m => m.id === data?.id), [data?.id]);

  if (!data || !med) {
    return (
      <View style={styles.container}>
        <MyText style={styles.title}>No medicine data provided.</MyText>
      </View>
    );
  }

  const dosageLine = [
    med.dosageMg ? `${med.dosageMg} mg` : null,
    med.doseText ?? null,
    med.form ? med.form : null,
  ].filter(Boolean).join(' • ');

  const timesLine = med.times?.length ? med.times.join(' – ') : '—';

  const instructionsText =
    med.instructions === 'before_food' ? 'Before food'
    : med.instructions === 'after_food' ? 'After food'
    : med.instructions === 'with_water' ? 'With water'
    : med.instructions ?? '—';

  const durationText =
    med.courseStart && med.courseEnd ? `${med.courseStart} → ${med.courseEnd}`
    : med.courseStart ? `Since ${med.courseStart}`
    : '—';

  const onEdit = () => navigation.navigate('AddEditMedicine', { editId: med.id });

  const onDelete = () => {
    console.log('Delete', med.id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* رأس: أيقونة ثابتة + الاسم */}
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="pill" size={22} color="#0EA5E9" />
        </View>
        <MyText style={styles.title}>{med.name}</MyText>
      </View>

      {/* التفاصيل */}
      <View style={styles.card}>
        <Row label="Dosage" value={dosageLine || '—'} />
        <Row label="Times" value={timesLine} />
        <Row label="Instructions" value={instructionsText} />
        <Row label="Duration" value={durationText} />
        {med.notes ? <Row label="Notes" value={med.notes} /> : null}
      </View>

      {/* الأزرار */}
      <View style={styles.actions}>
        <Button label="Edit" onPress={onEdit} />
        <View style={styles.redWrapper}>
          <Button label="Delete" variant="outline" onPress={onDelete} />
        </View>
      </View>
    </View>
  );
};

export default MedicineDetailScreen;

/* ---------- صفّ عرض بند ---------- */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <MyText style={styles.rowLabel}>{label}</MyText>
      <MyText style={styles.rowValue}>{value}</MyText>
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F2FE',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },

  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    gap: 8,
  },
  row: {},
  rowLabel: { fontSize: 12, color: '#6b7280' },
  rowValue: { fontSize: 15, color: '#111827', fontWeight: '500' },

  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },

  redWrapper: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
});
