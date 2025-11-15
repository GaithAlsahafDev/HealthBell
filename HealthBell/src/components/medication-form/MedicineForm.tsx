// src/components/medicines/MedicineForm.tsx
import React, { useState, useEffect } from 'react';
import {
  View, TextInput, Alert, ScrollView, TouchableOpacity
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MyText from '../MyText';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Field, UnitPicker, Chip, InstructionsPicker, type Unit } from './MedicineFormUI';

const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const;

const schema = Yup.object({
  name: Yup.string().trim().required('Medicine name is required'),
});

type MedicineFormProps = {
  editing?: Medicine;
  editId?: string;
  onSubmit: (payload: Medicine) => void;
  onCancel: () => void;
};

export default function MedicineForm({ editing, editId, onSubmit, onCancel }: MedicineFormProps) {

  // الحالة
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

  const onSave = (formName: string) => {
    const trimmedName = formName.trim();
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

      everyDay: everyDay,   // ← تمت إضافته هنا
      days: [...days],      // ← تمت إضافته هنا
    };

    onSubmit(payload);
  };


  return (
    <ScrollView keyboardShouldPersistTaps="handled" className="p-4 bg-white">
      <Formik
        initialValues={{ name: editing?.name ?? '' }}
        validationSchema={schema}
        enableReinitialize
        onSubmit={values => onSave(values.name)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <MyText className="text-[20px] font-bold mb-3 text-gray-900">{editId ? 'Edit medicine' : 'Add medicine'}</MyText>

            {/* اسم الدواء - إجباري */}
            <Field label="Medicine name *">
              <TextInput
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                className="h-11 border border-gray-200 rounded-[10px] px-3 bg-white text-gray-900"
                placeholder="Aspirin"
              />
              {touched.name && errors.name ? (
                <MyText className="text-red-500 text-xs mt-1">{errors.name}</MyText>
              ) : null}
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
              <TouchableOpacity className="flex-1 h-12 rounded-[10px] items-center justify-center flex-row gap-2 bg-sky-500" onPress={() => handleSubmit()} accessibilityRole="button">
                <MaterialCommunityIcons name="content-save" size={18} color="#fff" />
                <MyText className="text-white font-bold">{editId ? 'Save changes' : 'Add medicine'}</MyText>
              </TouchableOpacity>

              <TouchableOpacity className="flex-1 h-12 rounded-[10px] items-center justify-center flex-row gap-2 bg-gray-100" onPress={onCancel} accessibilityRole="button">
                <MyText className="text-gray-900 font-bold">Cancel</MyText>
              </TouchableOpacity>
            </View>

            {/* زر اختياري: مسح باركود */}
            <TouchableOpacity className="flex-row gap-2 h-12 rounded-[10px] items-center justify-center bg-white border border-sky-500" onPress={onScanBarcode} accessibilityRole="button">
              <MaterialCommunityIcons name="barcode-scan" size={18} color="#0EA5E9" />
              <MyText className="text-sky-500 font-bold">Scan barcode</MyText>
            </TouchableOpacity>

            <View className="h-6" />
          </>
        )}
      </Formik>
    </ScrollView>
  );
}
