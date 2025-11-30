// src/components/medicines/MedicineDurationSection.tsx
import React, { useState } from 'react'; 
import { View, TouchableOpacity } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
import MyText from '../MyText';
import { Field } from './MedicineFormUI';
import type { MedicineFormValues } from './MedicineForm';

type Props = {
  values: MedicineFormValues;
  setFieldValue: (field: string, value: any) => void;
  errors?: any;
  touched?: any;
};

export default function MedicineDurationSection({ values, setFieldValue, errors, touched }: Props) {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  return (
    <Field label="Treatment duration">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          className="flex-1 mr-2 h-11 border border-gray-200 rounded-[10px] px-3 bg-white justify-center"
          accessibilityRole="button"
        >
          <MyText className="text-gray-900">
            {values.courseStart || 'Start YYYY-MM-DD'}
          </MyText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          className="flex-1 h-11 border border-gray-200 rounded-[10px] px-3 bg-white justify-center"
          accessibilityRole="button"
        >
          <MyText className="text-gray-900">
            {values.courseEnd || 'End YYYY-MM-DD'}
          </MyText>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={values.courseStart ? new Date(values.courseStart) : new Date()}
          mode="date"
          display="default"
          onChange={(_event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) {
              const iso = selectedDate.toISOString().slice(0, 10);
              setFieldValue("courseStart", iso);
            }
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={values.courseEnd ? new Date(values.courseEnd) : new Date()}
          mode="date"
          display="default"
          onChange={(_event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) {
              const iso = selectedDate.toISOString().slice(0, 10);
              setFieldValue("courseEnd", iso);
            }
          }}
        />
      )}

      {touched?.courseEnd && errors?.courseEnd ? (
        <MyText className="text-red-500 text-xs mt-1">{errors.courseEnd}</MyText>
      ) : null}
    </Field>
  );
}
