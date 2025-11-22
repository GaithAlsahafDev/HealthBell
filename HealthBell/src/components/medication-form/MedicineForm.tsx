// src/components/medicines/MedicineForm.tsx
import React, { useState, useEffect } from 'react';
import {
  View, TextInput, Alert, ScrollView, TouchableOpacity
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MyText from '../MyText';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Field, Chip, InstructionsPicker, UNITS, type Unit } from './MedicineFormUI';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from '@react-native-picker/picker';


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
  const [doseAmount, setDoseAmount] = useState('');
  const [doseUnit, setDoseUnit] = useState<Unit>('mg');
  // النص الحر للجرعة مثل "1 tablet"
  const [doseText, setDoseText] = useState(editing?.doseText ?? '');
  // الأوقات
  const [times, setTimes] = useState<HHmm[]>(editing?.times ?? ([] as HHmm[]));
  const [newTime, setNewTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerValue, setTimePickerValue] = useState(new Date());

  // الأيام
  const [everyDay, setEveryDay] = useState(true);
  const [days, setDays] = useState<string[]>([...WEEKDAYS]);
  // المدة
  const [courseStart, setCourseStart] = useState(editing?.courseStart ?? '');
  const [courseEnd, setCourseEnd] = useState(editing?.courseEnd ?? '');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
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

  const addTime = () => {
    const trimmed = newTime.trim();
    if (!trimmed) return;

    const isValid = /^([01]\d|2[0-3]):[0-5]\d$/.test(trimmed);
    if (!isValid) {
      Alert.alert('Invalid time', 'Please enter time in HH:MM format, e.g. 09:00');
      return;
    }

    setTimes(prev => (prev.includes(trimmed as HHmm) ? prev : [...prev, trimmed as HHmm]));
    setNewTime('');
  };

  const removeTime = (t: string) => {
    setTimes(prev => prev.filter(x => x !== t));
  };

  const onSave = (formName: string) => {
    const trimmedName = formName.trim();
    const trimmedDoseText = doseText.trim();
    const trimmedCourseStart = courseStart.trim();
    const trimmedCourseEnd = courseEnd.trim();
    const trimmedAmount = doseAmount.trim();

    let doseTextFinal: string | null = null;
    if (trimmedDoseText.length > 0) {
      doseTextFinal = trimmedDoseText;
    } else if (trimmedAmount.length > 0) {
      doseTextFinal = `${trimmedAmount} ${doseUnit}`;
    }

    const timesArray = times;
    const hasTimes = timesArray.length > 0;

    const normalizedInstructions: MedicineInstruction | null =
      instructions && instructions.length > 0
        ? (instructions as MedicineInstruction)
        : "none";

    const payload: Medicine = {
      id: editing?.id ?? `m_${Date.now()}`,
      name: trimmedName,
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
                        {/* الجرعة: كمية + وحدة */}
            <Field label="Dosage">
              <View className="flex-row items-center">
                <TextInput
                  value={doseAmount}
                  onChangeText={setDoseAmount}
                  className="flex-1 mr-2 h-12 border border-gray-200 rounded-[10px] bg-white text-gray-900 text-[16px]"
                  style={{ paddingHorizontal: 16 }}
                  placeholder="500"
                  keyboardType="numeric"
                />
                <View className="w-[110px] h-12 border border-gray-200 rounded-[10px] bg-white justify-center">
                 <Picker
                  selectedValue={doseUnit}
                  onValueChange={(value) => setDoseUnit(value as Unit)}
                >
                  {UNITS.map(u => (
                    <Picker.Item key={u} label={u} value={u} />
                  ))}
                </Picker>

                </View>
              </View>
              <MyText className="text-[11px] text-gray-400 mt-1.5 mb-1.5">Optional: notes about the dose</MyText>
              <TextInput
                value={doseText}
                onChangeText={setDoseText}
                className="h-11 border border-gray-200 rounded-[10px] px-3 bg-white text-gray-900"
                placeholder="1 tablet"
              />
            </Field>


            {/* الأوقات */}
            <Field label="Times per day">
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  className="flex-1 mr-2 h-11 border border-gray-200 rounded-[10px] px-3 bg-white justify-center"
                  accessibilityRole="button"
                >
                  <MyText className="text-gray-900">
                    {newTime || 'Select time'}
                  </MyText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={addTime}
                  className="h-11 px-3 rounded-[10px] bg-sky-500 items-center justify-center flex-row"
                  accessibilityRole="button"
                >
                  <MaterialCommunityIcons name="plus" size={18} color="#fff" />
                  <MyText className="text-white font-bold ml-1">Add</MyText>
                </TouchableOpacity>
              </View>

              {showTimePicker && (
                <DateTimePicker
                  value={timePickerValue}
                  mode="time"
                  display="spinner"
                  onChange={(_event, selectedDate) => {
                    if (!selectedDate) {
                      setShowTimePicker(false);
                      return;
                    }
                    setShowTimePicker(false);
                    setTimePickerValue(selectedDate);
                    const hours = selectedDate.getHours().toString().padStart(2, '0');
                    const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
                    setNewTime(`${hours}:${minutes}`);
                  }}
                />
              )}

              <View className="flex-row flex-wrap gap-2 mt-2">
                {times.map(t => (
                  <View
                    key={t}
                    className="flex-row items-center bg-gray-100 rounded-full px-3 py-1"
                  >
                    <MyText className="text-[12px] text-gray-800 mr-1">{t}</MyText>
                    <TouchableOpacity onPress={() => removeTime(t)}>
                      <MaterialCommunityIcons name="close" size={14} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
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
                <TouchableOpacity
                  onPress={() => setShowStartPicker(true)}
                  className="flex-1 mr-2 h-11 border border-gray-200 rounded-[10px] px-3 bg-white justify-center"
                  accessibilityRole="button"
                >
                  <MyText className="text-gray-900">
                    {courseStart || 'Start YYYY-MM-DD'}
                  </MyText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowEndPicker(true)}
                  className="flex-1 h-11 border border-gray-200 rounded-[10px] px-3 bg-white justify-center"
                  accessibilityRole="button"
                >
                  <MyText className="text-gray-900">
                    {courseEnd || 'End YYYY-MM-DD'}
                  </MyText>
                </TouchableOpacity>
              </View>

              {showStartPicker && (
                <DateTimePicker
                  value={courseStart ? new Date(courseStart) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(_event, selectedDate) => {
                    setShowStartPicker(false);
                    if (selectedDate) {
                      const iso = selectedDate.toISOString().slice(0, 10);
                      setCourseStart(iso);
                    }
                  }}
                />
              )}

              {showEndPicker && (
                <DateTimePicker
                  value={courseEnd ? new Date(courseEnd) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(_event, selectedDate) => {
                    setShowEndPicker(false);
                    if (selectedDate) {
                      const iso = selectedDate.toISOString().slice(0, 10);
                      setCourseEnd(iso);
                    }
                  }}
                />
              )}
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
