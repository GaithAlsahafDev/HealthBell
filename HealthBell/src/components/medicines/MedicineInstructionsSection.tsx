// src/components/medicines/MedicineInstructionsSection.tsx
import React from 'react';
import { Field, InstructionsPicker } from './MedicineFormUI';
import type { MedicineFormValues } from './MedicineForm';
import MyText from '../MyText';
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

export default function MedicineInstructionsSection({ values, setFieldValue, errors, touched }: Props) {
  return (
    <Field label="Instructions (optional)">
      <InstructionsPicker
        value={values.instructions}
        onChange={(v) => setFieldValue("instructions", v)}
      />

      {touched?.instructions && errors?.instructions ? (
        <MyText className="text-red-500 text-xs mt-1">{errors.instructions}</MyText>
      ) : null}
    </Field>
  );
}
