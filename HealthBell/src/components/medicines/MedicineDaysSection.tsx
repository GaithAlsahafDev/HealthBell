// src/components/medicines/MedicineDaysSection.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import MyText from '../MyText';
import { Field, Chip } from './MedicineFormUI';
import type { MedicineFormValues } from './MedicineForm';
import type { FormikErrors, FormikTouched } from 'formik';

const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] as const;

type Props = {
  values: MedicineFormValues;
  setFieldValue: <K extends keyof MedicineFormValues>(
    field: K,
    value: MedicineFormValues[K]
  ) => void;
  errors?: FormikErrors<MedicineFormValues>;
  touched?: FormikTouched<MedicineFormValues>;
};

export default function MedicineDaysSection({ values, setFieldValue, errors, touched }: Props) {

  const toggleDay = (d: typeof WEEKDAYS[number]) => {
    if (values.everyDay) return;
    const arr = values.days.includes(d)
      ? values.days.filter(x => x !== d)
      : [...values.days, d];

    setFieldValue("days", arr);
  };

  const toggleEveryDay = () => {
    const v = !values.everyDay;
    setFieldValue("everyDay", v);
    setFieldValue("days", v ? [...WEEKDAYS] : []);
  };

  return (
    <Field label="Days">
      <View className="flex-row items-center justify-between mb-2">
        <TouchableOpacity
          onPress={toggleEveryDay}
          className={`w-[46px] h-[26px] rounded-full p-[3px] justify-center ${
            values.everyDay ? 'bg-sky-500' : 'bg-gray-200'
          }`}
        >
          <View
            className={`w-5 h-5 rounded-[10px] ${
              values.everyDay ? 'bg-white self-end' : 'bg-gray-400 self-start'
            }`}
          />
        </TouchableOpacity>
        <MyText className="text-gray-900">Every day</MyText>
      </View>

      <View className="flex-row flex-wrap gap-2 mt-2">
        {WEEKDAYS.map((d) => {
          const active = values.everyDay || values.days.includes(d);
          return (
            <Chip
              key={d}
              label={d}
              active={active}
              onPress={() => toggleDay(d)}
              disabled={values.everyDay}
            />
          );
        })}
      </View>

    </Field>
  );
}
