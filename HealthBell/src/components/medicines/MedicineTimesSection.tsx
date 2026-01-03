// src/components/medicines/MedicineTimesSection.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, Modal, Pressable } from 'react-native';
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

const MedicineTimesSection = ({ values, setFieldValue, errors, touched }: Props) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerValue, setTimePickerValue] = useState(new Date());
  const [iosTempValue, setIosTempValue] = useState(new Date());

  const removeTime = (t: string) => {
    setFieldValue("times", values.times.filter(x => x !== t));
  };

  const addPickedTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const picked = `${hours}:${minutes}`;
    if (!values.times.includes(picked as HHmm)) {
      setFieldValue("times", [...values.times, picked as HHmm]);
    }
  };

  return (
    <Field label="Times per day">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => {
            if (Platform.OS === 'ios') {
              setIosTempValue(timePickerValue);
            }
            setShowTimePicker(true);
          }}
          className="flex-1 mr-2 h-11 border border-gray-200 rounded-[10px] px-3 bg-white justify-center"
          accessibilityRole="button"
        >
          <MyText className="text-gray-900">
            Select time
          </MyText>
        </TouchableOpacity>
      </View>

      {showTimePicker && Platform.OS !== 'ios' && (
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
            addPickedTime(selectedDate);
          }}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal
          transparent
          visible={showTimePicker}
          animationType="fade"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <Pressable
            className="flex-1 justify-end"
            onPress={() => setShowTimePicker(false)}
          >
            <Pressable
              className="bg-white p-4 rounded-t-2xl border border-gray-200"
              onPress={() => {}}
            >
              <View className="flex-row justify-between mb-3">
                <TouchableOpacity onPress={() => setShowTimePicker(false)} accessibilityRole="button">
                  <MyText className="text-gray-600 font-semibold">Cancel</MyText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowTimePicker(false);
                    setTimePickerValue(iosTempValue);
                    addPickedTime(iosTempValue);
                  }}
                  accessibilityRole="button"
                >
                  <MyText className="text-sky-600 font-semibold">OK</MyText>
                </TouchableOpacity>
              </View>

              <DateTimePicker
                value={iosTempValue}
                mode="time"
                display="spinner"
                onChange={(_event, selectedDate) => {
                  if (selectedDate) {
                    setIosTempValue(selectedDate);
                  }
                }}
              />
            </Pressable>
          </Pressable>
        </Modal>
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
export default MedicineTimesSection;
