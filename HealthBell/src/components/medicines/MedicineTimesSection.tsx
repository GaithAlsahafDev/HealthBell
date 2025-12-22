// src/components/medicines/MedicineTimesSection.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MyText from '../MyText';
import { Field } from './MedicineFormUI';
import type { MedicineFormValues } from '../../types/medicine';
import type { FormikErrors, FormikTouched } from 'formik';

type Props = {
  values: MedicineFormValues;
  setFieldValue: <K extends keyof MedicineFormValues>(
    field: K,
    value: MedicineFormValues[K]
  ) => void;
  errors?: FormikErrors<MedicineFormValues>;
  touched?: FormikTouched<MedicineFormValues>;
};

export default function MedicineTimesSection({ values, setFieldValue, errors, touched }: Props) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerValue, setTimePickerValue] = useState(new Date());

  const addTime = () => {
    const trimmed = values.newTime.trim();
    if (!trimmed) return;

    const isValid = /^([01]\d|2[0-3]):[0-5]\d$/.test(trimmed);
    if (!isValid) {
      Alert.alert('Invalid time', 'Please enter time in HH:MM format, e.g. 09:00');
      return;
    }

    if (!values.times.includes(trimmed as HHmm)) {
      setFieldValue("times", [...values.times, trimmed as HHmm]);
    }
    setFieldValue("newTime", '');
  };

  const removeTime = (t: string) => {
    setFieldValue("times", values.times.filter(x => x !== t));
  };

  return (
    <Field label="Times per day">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          className="flex-1 mr-2 h-11 border border-gray-200 rounded-[10px] px-3 bg-white justify-center"
          accessibilityRole="button"
        >
          <MyText className="text-gray-900">
            {values.newTime || 'Select time'}
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
            setFieldValue("newTime", `${hours}:${minutes}`);
          }}
        />
      )}

      <View className="flex-row flex-wrap gap-2 mt-2">
        {values.times.map(t => (
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

      {touched?.times && errors?.times ? (
        <MyText className="text-red-500 text-xs mt-1">{errors.times}</MyText>
      ) : null}
    </Field>
  );
}
