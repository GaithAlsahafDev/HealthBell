// src/screens/medicines/AddEditMedicineScreen.tsx
import React, { useMemo, useState, useEffect } from 'react';
import {
  View, TextInput, Alert, ScrollView, TouchableOpacity
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { MedicinesStackNavProps } from '../../navigation/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MyText from '../../components/MyText';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { add, update } from '../../store/store-slices/MedicinesSlice';

const UNITS = ['mg', 'ml', 'g', 'mcg', 'drops', 'tablet', 'capsule'] as const;
type Unit = (typeof UNITS)[number];
const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const;

export default function AddEditMedicineScreen() {
  const navigation = useNavigation<MedicinesStackNavProps<'AddEditMedicine'>['navigation']>();
  const route = useRoute<MedicinesStackNavProps<'AddEditMedicine'>['route']>();
  const editId = route.params?.editId;

  const dispatch = useAppDispatch();
  const medicines = useAppSelector(s => s.medicines) as Medicine[];

  const editing = useMemo(() => medicines.find(m => m.id === editId), [editId, medicines]);

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

    const trimmedName = name.trim();
    const trimmedDoseText = doseText.trim();
    const trimmedCourseStart = courseStart.trim();
    const trimmedCourseEnd = courseEnd.trim();

    const hasAmount = doseAmount.trim().length > 0;
    const amountNum = hasAmount ? Number(doseAmount) : null;
    const dosageMg = doseUnit === 'mg' && amountNum !== null ? amountNum : null;

    let doseTextFinal: string | null = null;
    if (trimmedDoseText.length > 0) {
      doseTextFinal = trimmedDoseText;
    } else if (doseUnit !== 'mg' && amountNum !== null) {
      doseTextFinal = `${amountNum} ${doseUnit}`;
    }

    const timesArray = timesCsv
      ? (timesCsv
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0) as HHmm[])
      : ([] as HHmm[]);
    const hasTimes = timesArray.length > 0;

    const normalizedInstructions: MedicineInstruction | null =
      instructions && instructions.length > 0
        ? (instructions as MedicineInstruction)
        : "none";

    const payload: Medicine = {
      id: editing?.id ?? `m_${Date.now()}`,
      name: trimmedName,
      ...(dosageMg !== null ? { dosageMg } : {}),
      ...(doseTextFinal !== null ? { doseText: doseTextFinal } : {}),
      ...(hasTimes ? { times: timesArray } : {}),
      ...(trimmedCourseStart.length > 0 ? { courseStart: trimmedCourseStart } : {}),
      ...(trimmedCourseEnd.length > 0 ? { courseEnd: trimmedCourseEnd } : {}),
      ...(normalizedInstructions !== "none"
        ? { instructions: normalizedInstructions }
        : {}),
    };

    if (editId) {
      dispatch(update(payload));
    } else {
      dispatch(add(payload));
    }

    console.log(editId ? 'UPDATE MEDICINE' : 'CREATE MEDICINE', payload);
    Alert.alert(editId ? 'Medicine updated' : 'Medicine added');
    navigation.goBack();
  };


  return (
    <ScrollView keyboardShouldPersistTaps="handled" className="p-4 bg-white">
      <MyText className="text-[20px] font-bold mb-3 text-gray-900">{editId ? 'Edit medicine' : 'Add medicine'}</MyText>

      {/* اسم الدواء - إجباري */}
      <Field label="Medicine name *">
        <TextInput
          value={name}
          onChangeText={setName}
          className="h-11 border border-gray-200 rounded-[10px] px-3 bg-white text-gray-900"
          placeholder="Aspirin"
        />
      </Field>

      {/* الجرعة: كمية + وحدة */}
      <Field label="Dosage">
        <View className="flex-row items-center">
          <TextInput
            value={doseAmount}
            onChangeText={setDoseAmount}
            className="flex-1 mr-2 h-11 border border-gray-200 rounded-[10px] px-3 bg-white text-gray-900"
            placeholder="500"
            keyboardType="numeric"
          />
          <UnitPicker value={doseUnit} onChange={setDoseUnit} />
        </View>
        <MyText className="text-[11px] text-gray-400 mt-1.5 mb-1.5">Optional: free text</MyText>
        <TextInput
          value={doseText}
          onChangeText={setDoseText}
          className="h-11 border border-gray-200 rounded-[10px] px-3 bg-white text-gray-900"
          placeholder="1 tablet"
        />
      </Field>

      {/* الأوقات */}
      <Field label="Times per day">
        <TextInput
          value={timesCsv}
          onChangeText={setTimesCsv}
          className="h-11 border border-gray-200 rounded-[10px] px-3 bg-white text-gray-900"
          placeholder="09:00, 13:00, 21:00"
          autoCapitalize="none"
        />
      </Field>

      {/* الأيام */}
      <Field label="Days">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={toggleEveryDay} className={`w-[46px] h-[26px] rounded-full p-[3px] justify-center ${everyDay ? 'bg-sky-500' : 'bg-gray-200'}`}>
            <View className={`w-5 h-5 rounded-[10px] ${everyDay ? 'bg-white self-end' : 'bg-gray-400 self-start'}`} />
          </TouchableOpacity>
          <MyText className="text-gray-900">Every day</MyText>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-2">
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
        <View className="flex-row items-center">
          <TextInput
            value={courseStart}
            onChangeText={setCourseStart}
            className="flex-1 mr-2 h-11 border border-gray-200 rounded-[10px] px-3 bg-white text-gray-900"
            placeholder="Start YYYY-MM-DD"
            autoCapitalize="none"
          />
          <TextInput
            value={courseEnd}
            onChangeText={setCourseEnd}
            className="flex-1 h-11 border border-gray-200 rounded-[10px] px-3 bg-white text-gray-900"
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
      <View className="flex-row gap-3 mt-2 mb-3">
        <TouchableOpacity className="flex-1 h-12 rounded-[10px] items-center justify-center flex-row gap-2 bg-sky-500" onPress={onSave} accessibilityRole="button">
          <MaterialCommunityIcons name="content-save" size={18} color="#fff" />
          <MyText className="text-white font-bold">{editId ? 'Save changes' : 'Add medicine'}</MyText>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 h-12 rounded-[10px] items-center justify-center flex-row gap-2 bg-gray-100" onPress={() => navigation.goBack()} accessibilityRole="button">
          <MyText className="text-gray-900 font-bold">Cancel</MyText>
        </TouchableOpacity>
      </View>

      {/* زر اختياري: مسح باركود */}
      <TouchableOpacity className="flex-row gap-2 h-12 rounded-[10px] items-center justify-center bg-white border border-sky-500" onPress={onScanBarcode} accessibilityRole="button">
        <MaterialCommunityIcons name="barcode-scan" size={18} color="#0EA5E9" />
        <MyText className="text-sky-500 font-bold">Scan barcode</MyText>
      </TouchableOpacity>

      <View className="h-6" />
    </ScrollView>
  );
}

/* ---------- عناصر مساعدة ---------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="mb-[14px]">
      <MyText className="text-[12px] text-gray-500 mb-1.5">{label}</MyText>
      {children}
    </View>
  );
}

function UnitPicker({ value, onChange }: { value: Unit; onChange: (u: Unit) => void }) {
  return (
    <View className="flex-row flex-wrap gap-1.5">
      {UNITS.map(u => (
        <TouchableOpacity
          key={u}
          onPress={() => onChange(u)}
          className={`h-9 px-2.5 rounded-lg border items-center justify-center mb-1.5 ${value === u ? 'bg-sky-500 border-sky-500' : 'bg-white border-gray-300'}`}
          accessibilityRole="button"
        >
          <MyText className={`font-semibold ${value === u ? 'text-white' : 'text-gray-700'}`}>{u}</MyText>
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
      className={`h-[34px] px-3 rounded-full border items-center justify-center ${active ? 'bg-sky-500 border-sky-500' : 'bg-white border-gray-300'} ${disabled ? 'opacity-50' : ''}`}
      accessibilityRole="button"
    >
      <MyText className={`text-[12px] font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{label}</MyText>
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
    <View className="flex-row flex-wrap gap-2 mt-2">
      {options.map(opt => {
        const active = value === opt.key;
        return (
          <TouchableOpacity
            key={opt.key}
            onPress={() => onChange(opt.key)}
            className={`h-[34px] px-3 rounded-full border items-center justify-center ${active ? 'bg-sky-500 border-sky-500' : 'bg-white border-gray-300'}`}
            accessibilityRole="button"
          >
            <MyText className={`text-[12px] font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{opt.label}</MyText>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity onPress={() => onChange('')} className="h-[34px] px-3 rounded-full border bg-white border-gray-300 items-center justify-center" accessibilityRole="button">
        <MyText className="text-[12px] font-semibold text-gray-700">None</MyText>
      </TouchableOpacity>
    </View>
  );
}
