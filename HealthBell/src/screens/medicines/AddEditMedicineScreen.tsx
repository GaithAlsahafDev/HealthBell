// src/screens/medicines/AddEditMedicineScreen.tsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  View, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { MedicinesStackNavProps } from '../../navigation/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MyText from '../../components/MyText';

// بيانات موك من JSON
const { medicines } = require('../../data/medicines.json') as {
  medicines: {
    id: string;
    name: string;
    dosageMg?: number;        // سنحوّله من (amount + unit) إذا كانت الوحدة mg
    form?: string;
    doseText?: string;
    times?: string[];         // ["09:00","13:00","21:00"]
    instructions?: 'before_food' | 'after_food' | 'with_water' | string;
    courseStart?: string;     // "YYYY-MM-DD"
    courseEnd?: string;
    notes?: string;
  }[];
};

const UNITS = ['mg', 'ml', 'g', 'mcg', 'drops', 'tablet', 'capsule'] as const;
type Unit = (typeof UNITS)[number];
const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const;

export default function AddEditMedicineScreen() {
  const navigation = useNavigation<MedicinesStackNavProps<'AddEditMedicine'>['navigation']>();
  const route = useRoute<MedicinesStackNavProps<'AddEditMedicine'>['route']>();
  const editId = route.params?.editId;

  const editing = useMemo(() => medicines.find(m => m.id === editId), [editId]);

  // الحالة
  const [name, setName] = useState(editing?.name ?? '');
  // الجرعة = كمية + وحدة
  const [doseAmount, setDoseAmount] = useState(editing?.dosageMg ? String(editing.dosageMg) : '');
  const [doseUnit, setDoseUnit] = useState<Unit>('mg');
  // النص الحر للجرعة مثل "1 tablet"
  const [doseText, setDoseText] = useState(editing?.doseText ?? '');
  // الأوقات
  const [timesCsv, setTimesCsv] = useState(editing?.times?.join(', ') ?? ''); // "09:00, 13:00"
  // الأيام
  const [everyDay, setEveryDay] = useState(true);
  const [days, setDays] = useState<string[]>([...WEEKDAYS]);
  // المدة
  const [courseStart, setCourseStart] = useState(editing?.courseStart ?? '');
  const [courseEnd, setCourseEnd] = useState(editing?.courseEnd ?? '');
  // التعليمات
  const [instructions, setInstructions] = useState(editing?.instructions ?? '');

  // تهيئة من بيانات قديمة
  useEffect(() => {
    if (!editing) return;
    if (!editing.doseText && editing.form) setDoseText(editing.form);
  }, [editing]);

  // تبديل يوم
  const toggleDay = (d: string) => {
    if (everyDay) return;
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  // تبديل "كل يوم"
  const toggleEveryDay = () => {
    const v = !everyDay;
    setEveryDay(v);
    setDays(v ? [...WEEKDAYS] : []);
  };

  const onScanBarcode = () => {
    Alert.alert('Scan barcode', 'Connect to camera flow here.');
  };

  const validate = () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Medicine name is required.');
      return false;
    }
    return true;
  };

  const onSave = () => {
    if (!validate()) return;

    const amountNum = doseAmount ? Number(doseAmount) : undefined;
    const dosageMg = doseUnit === 'mg' && amountNum ? amountNum : undefined;

    const payload = {
      id: editing?.id ?? `m_${Date.now()}`,
      name: name.trim(),
      dosageMg,                               // رقمي إذا mg
      doseText: doseText || (doseUnit !== 'mg' && amountNum ? `${amountNum} ${doseUnit}` : doseText) || undefined,
      times: timesCsv ? timesCsv.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      days: everyDay ? [...WEEKDAYS] : days,
      courseStart: courseStart || undefined,
      courseEnd: courseEnd || undefined,
      instructions: instructions || undefined,
    };

    console.log(editId ? 'UPDATE MEDICINE' : 'CREATE MEDICINE', payload);
    Alert.alert(editId ? 'Medicine updated' : 'Medicine added');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <MyText style={styles.title}>{editId ? 'Edit medicine' : 'Add medicine'}</MyText>

      {/* اسم الدواء - إجباري */}
      <Field label="Medicine name *">
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Aspirin"
        />
      </Field>

      {/* الجرعة: كمية + وحدة */}
      <Field label="Dosage">
        <View style={styles.row}>
          <TextInput
            value={doseAmount}
            onChangeText={setDoseAmount}
            style={styles.inputFlexRight}
            placeholder="500"
            keyboardType="numeric"
          />
          <UnitPicker value={doseUnit} onChange={setDoseUnit} />
        </View>
        <MyText style={styles.hint}>Optional: free text</MyText>
        <TextInput
          value={doseText}
          onChangeText={setDoseText}
          style={styles.input}
          placeholder="1 tablet"
        />
      </Field>

      {/* الأوقات */}
      <Field label="Times per day">
        <TextInput
          value={timesCsv}
          onChangeText={setTimesCsv}
          style={styles.input}
          placeholder="09:00, 13:00, 21:00"
          autoCapitalize="none"
        />
      </Field>

      {/* الأيام */}
      <Field label="Days">
        <View style={styles.rowBetween}>
          <TouchableOpacity onPress={toggleEveryDay} style={[styles.switch, everyDay && styles.switchOn]}>
            <View style={[styles.dot, everyDay && styles.dotOn]} />
          </TouchableOpacity>
          <MyText style={styles.everyDayText}>Every day</MyText>
        </View>

        <View style={styles.chipsWrap}>
          {WEEKDAYS.map(d => {
            const active = everyDay || days.includes(d);
            return (
              <Chip
                key={d}
                label={d}
                active={active}
                onPress={() => toggleDay(d)}
                disabled={everyDay}
              />
            );
          })}
        </View>
      </Field>

      {/* المدة */}
      <Field label="Treatment duration">
        <View style={styles.row}>
          <TextInput
            value={courseStart}
            onChangeText={setCourseStart}
            style={styles.inputFlexRight}
            placeholder="Start YYYY-MM-DD"
            autoCapitalize="none"
          />
          <TextInput
            value={courseEnd}
            onChangeText={setCourseEnd}
            style={styles.inputFlex}
            placeholder="End YYYY-MM-DD"
            autoCapitalize="none"
          />
        </View>
      </Field>

      {/* التعليمات */}
      <Field label="Instructions (optional)">
        <InstructionsPicker value={instructions} onChange={setInstructions} />
      </Field>

      {/* أزرار الإجراء */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onSave} accessibilityRole="button">
          <MaterialCommunityIcons name="content-save" size={18} color="#fff" />
          <MyText style={styles.btnText}>{editId ? 'Save changes' : 'Add medicine'}</MyText>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={() => navigation.goBack()} accessibilityRole="button">
          <MyText style={styles.btnTextCancel}>Cancel</MyText>
        </TouchableOpacity>
      </View>

      {/* زر اختياري: مسح باركود */}
      <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={onScanBarcode} accessibilityRole="button">
        <MaterialCommunityIcons name="barcode-scan" size={18} color="#0EA5E9" />
        <MyText style={styles.btnTextOutline}>Scan barcode</MyText>
      </TouchableOpacity>

      <View style={styles.sp24} />
    </ScrollView>
  );
}

/* ---------- عناصر مساعدة ---------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.fieldWrap}>
      <MyText style={styles.label}>{label}</MyText>
      {children}
    </View>
  );
}

function UnitPicker({ value, onChange }: { value: Unit; onChange: (u: Unit) => void }) {
  return (
    <View style={styles.unitWrap}>
      {UNITS.map(u => (
        <TouchableOpacity
          key={u}
          onPress={() => onChange(u)}
          style={[styles.unit, value === u && styles.unitActive]}
          accessibilityRole="button"
        >
          <MyText style={[styles.unitText, value === u && styles.unitTextActive]}>{u}</MyText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function Chip({
  label, active, onPress, disabled
}: { label: string; active: boolean; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.chip, active && styles.chipActive, disabled && styles.disabled]}
      accessibilityRole="button"
    >
      <MyText style={[styles.chipText, active && styles.chipTextActive]}>{label}</MyText>
    </TouchableOpacity>
  );
}

function InstructionsPicker({
  value, onChange
}: { value: string; onChange: (v: string) => void }) {
  const options = [
    { key: 'before_food', label: 'Before food' },
    { key: 'after_food', label: 'After food' },
    { key: 'with_water', label: 'With water' },
  ];
  return (
    <View style={styles.chipsWrap}>
      {options.map(opt => {
        const active = value === opt.key;
        return (
          <TouchableOpacity
            key={opt.key}
            onPress={() => onChange(opt.key)}
            style={[styles.chip, active && styles.chipActive]}
            accessibilityRole="button"
          >
            <MyText style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</MyText>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity onPress={() => onChange('')} style={styles.chip} accessibilityRole="button">
        <MyText style={styles.chipText}>None</MyText>
      </TouchableOpacity>
    </View>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#111827' },
  label: { fontSize: 12, color: '#6b7280', marginBottom: 6 },
  fieldWrap: { marginBottom: 14 },

  input: {
    height: 44, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
    paddingHorizontal: 12, backgroundColor: '#fff', color: '#111827',
  },
  inputFlexRight: { flex: 1, marginRight: 8, height: 44, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#fff', color: '#111827' },
  inputFlex: { flex: 1, height: 44, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#fff', color: '#111827' },

  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },

  // Units
  unitWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  unit: {
    height: 36, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db',
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  unitActive: { backgroundColor: '#0EA5E9', borderColor: '#0EA5E9' },
  unitText: { color: '#374151', fontWeight: '600' },
  unitTextActive: { color: '#fff' },

  // Days chips
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: {
    height: 34, paddingHorizontal: 12, borderRadius: 9999, borderWidth: 1, borderColor: '#d1d5db',
    alignItems: 'center', justifyContent: 'center',
  },
  chipActive: { backgroundColor: '#0EA5E9', borderColor: '#0EA5E9' },
  chipText: { color: '#374151', fontWeight: '600', fontSize: 12 },
  chipTextActive: { color: '#fff' },
  disabled: { opacity: 0.5 },

  // Switch (Every day)
  switch: {
    width: 46, height: 26, borderRadius: 9999, backgroundColor: '#e5e7eb', padding: 3, justifyContent: 'center',
  },
  switchOn: { backgroundColor: '#0EA5E9' },
  dot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#9ca3af', alignSelf: 'flex-start' },
  dotOn: { backgroundColor: '#fff', alignSelf: 'flex-end' },
  everyDayText: { color: '#111827' },

  // Actions
  actions: { flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 12 },
  btn: {
    flex: 1, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 8,
  },
  btnPrimary: { backgroundColor: '#0EA5E9' },
  btnGhost: { backgroundColor: '#f3f4f6' },
  btnOutline: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#0EA5E9' },
  btnText: { color: '#fff', fontWeight: '700' },
  btnTextCancel: { color: '#111827', fontWeight: '700' },
  btnTextOutline: { color: '#0EA5E9', fontWeight: '700' },

  hint: { fontSize: 11, color: '#9ca3af', marginTop: 6, marginBottom: 6 },

  sp24: { height: 24 },
});
