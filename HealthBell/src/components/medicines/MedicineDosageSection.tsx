// src/components/medicines/MedicineDosageSection.tsx 
import React from 'react';
import { View, TextInput } from 'react-native';
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
          <Picker
            selectedValue={values.doseUnit}
            onValueChange={(value) => setFieldValue("doseUnit", value as Unit)}
          >
            {UNITS.map(u => (
              <Picker.Item key={u} label={u} value={u} />
            ))}
          </Picker>
        </View>
      </View>

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
