// src/components/medicines/MedicineDosageSection.tsx 
import React, { useState } from 'react';
import { View, TextInput, Modal, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MyText from '../MyText';
import MyTextInput from '../MyTextInput';
import { Field } from './MedicineFormUI';
import { UNITS, type Unit, type MedicineFormValues } from '../../types/medicine';
import type { FormikErrors, FormikTouched } from 'formik';

type Props = {
  values: MedicineFormValues;
  setFieldValue: <K extends keyof MedicineFormValues>(
    field: K,
    value: MedicineFormValues[K]
  ) => void;
  errors?: FormikErrors<MedicineFormValues>;
  touched?: FormikTouched<MedicineFormValues>;
  doseAmountRef?: React.RefObject<TextInput | null>;
  doseTextRef?: React.RefObject<TextInput | null>;
};

const MedicineDosageSection = ({ values, setFieldValue, errors, touched, doseAmountRef, doseTextRef }: Props) => {
  const [showUnitPicker, setShowUnitPicker] = useState(false);
  const [tempUnit, setTempUnit] = useState<Unit>(values.doseUnit);

  return (
    <Field label="Dosage">
      <View className="flex-row items-center">
        <MyTextInput
          ref={doseAmountRef}
          value={values.doseAmount}
          onChangeText={(v) => setFieldValue("doseAmount", v)}
          className="flex-1 mr-2 h-12 border border-gray-200 rounded-[10px] bg-white text-gray-900 text-[16px] px-4"
          placeholder="500"
          keyboardType="numeric"
          returnKeyType="next"
          onSubmitEditing={() => {
            doseTextRef?.current?.focus();
          }}
        />
        <View className="w-[110px] h-12 border border-gray-200 rounded-[10px] bg-white justify-center">
          {Platform.OS === 'ios' ? (
            <TouchableOpacity
              onPress={() => {
                setTempUnit(values.doseUnit);
                setShowUnitPicker(true);
              }}
              className="h-12 px-3 justify-center"
              accessibilityRole="button"
            >
              <MyText className="text-gray-900 text-[16px]">{values.doseUnit}</MyText>
            </TouchableOpacity>
          ) : (
            <Picker
              selectedValue={values.doseUnit}
              onValueChange={(value) => setFieldValue("doseUnit", value as Unit)}
            >
              {UNITS.map(u => (
                <Picker.Item key={u} label={u} value={u} />
              ))}
            </Picker>
          )}
        </View>
      </View>

      {Platform.OS === 'ios' && showUnitPicker && (
        <Modal transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white p-4 rounded-t-2xl">
              <View className="h-[216px]">
                <Picker
                  selectedValue={tempUnit}
                  onValueChange={(value) => setTempUnit(value as Unit)}
                >
                  {UNITS.map(u => (
                    <Picker.Item key={u} label={u} value={u} />
                  ))}
                </Picker>
              </View>

              <View className="flex-row gap-3 mt-3">
                <TouchableOpacity
                  className="flex-1 h-11 items-center justify-center rounded-lg bg-gray-100"
                  onPress={() => setShowUnitPicker(false)}
                >
                  <MyText>Cancel</MyText>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 h-11 items-center justify-center rounded-lg bg-sky-500"
                  onPress={() => {
                    setFieldValue("doseUnit", tempUnit);
                    setShowUnitPicker(false);
                  }}
                >
                  <MyText className="text-white font-bold">Confirm</MyText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {touched?.doseAmount && errors?.doseAmount ? (
        <MyText className="text-red-500 text-xs mt-1">{errors.doseAmount}</MyText>
      ) : null}

      <MyText className="text-[11px] text-gray-400 mt-1.5 mb-1.5">Optional: notes about the dose</MyText>
      <MyTextInput
        ref={doseTextRef}
        value={values.doseText}
        onChangeText={(v) => setFieldValue("doseText", v)}
        className="h-11 border border-gray-200 rounded-[10px] px-3 bg-white text-gray-900"
        placeholder="1 tablet"
        returnKeyType="done"
      />
    </Field>
  );
}
export default MedicineDosageSection;
