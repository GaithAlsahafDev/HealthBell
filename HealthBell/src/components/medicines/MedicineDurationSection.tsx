// src/components/medicines/MedicineDurationSection.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Platform } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";
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

const MedicineDurationSection = ({ values, setFieldValue, errors, touched }: Props) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const toISODate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const confirmDate = (field: "courseStart" | "courseEnd") => {
    const iso = toISODate(tempDate);
    setFieldValue(field, iso);
    field === "courseStart" ? setShowStartPicker(false) : setShowEndPicker(false);
  };

  return (
    <Field label="Treatment duration *">
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => {
            setTempDate(values.courseStart ? new Date(values.courseStart) : new Date());
            setShowStartPicker(true);
          }}
          className="flex-1 mr-2 h-11 border border-gray-200 rounded-[10px] px-3 bg-white justify-center"
          accessibilityRole="button"
        >
          <MyText className="text-gray-900">
            {values.courseStart || 'Start YYYY-MM-DD'}
          </MyText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setTempDate(values.courseEnd ? new Date(values.courseEnd) : new Date());
            setShowEndPicker(true);
          }}
          className="flex-1 h-11 border border-gray-200 rounded-[10px] px-3 bg-white justify-center"
          accessibilityRole="button"
        >
          <MyText className="text-gray-900">
            {values.courseEnd || 'End YYYY-MM-DD'}
          </MyText>
        </TouchableOpacity>
      </View>

      {(showStartPicker || showEndPicker) && Platform.OS === 'ios' && (
        <Modal transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white p-4 rounded-t-2xl">
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(_, d) => d && setTempDate(d)}
              />

              <View className="flex-row gap-3 mt-3">
                <TouchableOpacity
                  className="flex-1 h-11 items-center justify-center rounded-lg bg-gray-100"
                  onPress={() => {
                    setShowStartPicker(false);
                    setShowEndPicker(false);
                  }}
                >
                  <MyText>Cancel</MyText>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 h-11 items-center justify-center rounded-lg bg-sky-500"
                  onPress={() =>
                    confirmDate(showStartPicker ? "courseStart" : "courseEnd")
                  }
                >
                  <MyText className="text-white font-bold">Confirm</MyText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS !== 'ios' && showStartPicker && (
        <DateTimePicker
          value={values.courseStart ? new Date(values.courseStart) : new Date()}
          mode="date"
          display="default"
          onChange={(_, d) => {
            setShowStartPicker(false);
            if (d) {
              setFieldValue("courseStart", toISODate(d));
            }
          }}
        />
      )}

      {Platform.OS !== 'ios' && showEndPicker && (
        <DateTimePicker
          value={values.courseEnd ? new Date(values.courseEnd) : new Date()}
          mode="date"
          display="default"
          onChange={(_, d) => {
            setShowEndPicker(false);
            if (d) {
              setFieldValue("courseEnd", toISODate(d));
            }
          }}
        />
      )}

      {touched?.courseStart && errors?.courseStart ? (
        <MyText className="text-red-500 text-xs mt-1">{errors.courseStart}</MyText>
      ) : null}

      {touched?.courseEnd && errors?.courseEnd ? (
        <MyText className="text-red-500 text-xs mt-1">{errors.courseEnd}</MyText>
      ) : null}
    </Field>
  );
}
export default MedicineDurationSection;
