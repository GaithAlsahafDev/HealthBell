// src/components/medicines/MedicineForm.tsx
import React, { useRef } from 'react';
import {View, TextInput, ScrollView, TouchableOpacity} from 'react-native';
import MyText from '../MyText';
import MyTextInput from '../MyTextInput';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Field } from './MedicineFormUI';

import MedicineDosageSection from './MedicineDosageSection';
import MedicineTimesSection from './MedicineTimesSection';
import MedicineDaysSection from './MedicineDaysSection';
import MedicineDurationSection from './MedicineDurationSection';
import MedicineInstructionsSection from './MedicineInstructionsSection';
import { MedicineFormValues, Unit } from '../../types/medicine';

const schema = Yup.object({
  name: Yup.string().trim().required('Medicine name is required'),

  doseAmount: Yup.number()
    .typeError("Dosage must be a number")
    .positive("Dosage must be positive")
    .required("Dosage is required"),

  times: Yup.array()
    .min(1, "At least one time is required"),

  courseStart: Yup.string()
    .trim()
    .required("Course start date is required"),

  courseEnd: Yup.string().test(
    "end-after-start",
    "End date must be after start date",
    function (value) {
      const { courseStart } = this.parent;
      if (!courseStart || !value) return true;
      return new Date(value) >= new Date(courseStart);
    }
  ),
});

type MedicineFormProps = {
  editing?: Medicine;
  editId?: string;
  onSubmit: (payload: Medicine) => void;
  onCancel: () => void;
};

function buildMedicinePayload(vals: MedicineFormValues, editing?: Medicine): Medicine {
  const trimmedName = vals.name.trim();
  const trimmedDoseText = vals.doseText.trim();
  const trimmedCourseStart = vals.courseStart.trim();
  const trimmedCourseEnd = vals.courseEnd.trim();
  const trimmedAmount = vals.doseAmount.trim();

  let doseTextFinal: string | null = null;
  if (trimmedDoseText.length > 0) {
    doseTextFinal = trimmedDoseText;
  }

  const normalizedInstructions: MedicineInstruction | null =
    vals.instructions && vals.instructions.length > 0
      ? (vals.instructions as MedicineInstruction)
      : "none";

  const payload: Medicine = {
    id: editing?.id ?? `m_${Date.now()}`,
    name: trimmedName,
    doseAmount: trimmedAmount,
    doseUnit: vals.doseUnit,
    ...(doseTextFinal !== null ? { doseText: doseTextFinal } : {}),
    times: vals.times,
    courseStart: trimmedCourseStart,
    ...(trimmedCourseEnd.length > 0 ? { courseEnd: trimmedCourseEnd } : {}),
    ...(normalizedInstructions !== "none"
      ? { instructions: normalizedInstructions }
      : {}),

    everyDay: vals.everyDay,
    days: [...vals.days],
  };

  return payload;
}

const MedicineForm = ({ editing, editId, onSubmit, onCancel }: MedicineFormProps) => {

  const doseAmountRef = useRef<TextInput | null>(null);
  const doseTextRef = useRef<TextInput | null>(null);

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    errors,
    touched
  } = useFormik<MedicineFormValues>({
    initialValues: {
      name: editing?.name ?? '',
      doseAmount: editing?.doseAmount ?? '',
      doseUnit: (editing?.doseUnit as Unit) ?? 'mg',
      doseText: editing?.doseText ?? '',
      times: editing?.times ?? ([] as HHmm[]),
      newTime: '',
      everyDay: true,
      days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      courseStart: editing?.courseStart ?? '',
      courseEnd: editing?.courseEnd ?? '',
      instructions: editing?.instructions ?? '',
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: (vals) => {
      const payload = buildMedicinePayload(vals, editing);
      onSubmit(payload);
    },
  });

  return (
    <ScrollView keyboardShouldPersistTaps="handled" className="p-4 bg-white">
      <>
        <MyText className="text-[20px] font-bold mb-3 text-gray-900">{editId ? 'Edit medicine' : 'Add medicine'}</MyText>

        {/* Medicine name – required */}
        <Field label="Medicine name *">
          <MyTextInput
            value={values.name}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            className="h-11 border border-gray-200 rounded-[10px] px-3 bg-white text-gray-900"
            placeholder="Aspirin"
            returnKeyType="next"
            onSubmitEditing={() => {
              doseAmountRef.current?.focus();
            }}
          />
          {touched.name && errors.name ? (
            <MyText className="text-red-500 text-xs mt-1">{errors.name}</MyText>
          ) : null}
        </Field>

        {/* Dose */}
        <MedicineDosageSection
          values={values}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
          doseAmountRef={doseAmountRef}
          doseTextRef={doseTextRef}
        />

        {/* Times */}
        <MedicineTimesSection
          values={values}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />

        {/* Days */}
        <MedicineDaysSection values={values} setFieldValue={setFieldValue} />

        {/* Duration */}
        <MedicineDurationSection
          values={values}
          setFieldValue={setFieldValue}
          errors={errors}
          touched={touched}
        />

        {/* Instructions */}
        <MedicineInstructionsSection values={values} setFieldValue={setFieldValue} />

        {/* Action buttons */}
        <View className="flex-row gap-3 mt-2 mb-3">
          <TouchableOpacity className="flex-1 h-12 rounded-[10px] items-center justify-center flex-row gap-2 bg-sky-500" onPress={() => handleSubmit()} accessibilityRole="button">
            <MyText className="text-white font-bold">{editId ? 'Save changes' : 'Add medicine'}</MyText>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 h-12 rounded-[10px] items-center justify-center flex-row gap-2 bg-gray-100" onPress={onCancel} accessibilityRole="button">
            <MyText className="text-gray-900 font-bold">Cancel</MyText>
          </TouchableOpacity>
        </View>

        <View className="h-6" />
      </>
    </ScrollView>
  );
}
export default MedicineForm;
