// src/screens/medicines/AddEditMedicineScreen.tsx
import React, { useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { MedicinesStackNavProps } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { add, update } from '../../store/store-slices/MedicinesSlice';
import MedicineForm from '../../components/medication-form/MedicineForm';

export default function AddEditMedicineScreen() {
  const navigation = useNavigation<MedicinesStackNavProps<'AddEditMedicine'>['navigation']>();
  const route = useRoute<MedicinesStackNavProps<'AddEditMedicine'>['route']>();
  const editId = route.params?.editId;

  const dispatch = useAppDispatch();
  const medicines = useAppSelector(s => s.medicines) as Medicine[];

  const editing = useMemo(() => medicines.find(m => m.id === editId), [editId, medicines]);

  const handleSubmit = (payload: Medicine) => {
    if (editId) {
      dispatch(update(payload));
    } else {
      dispatch(add(payload));
    }

    console.log(editId ? 'UPDATE MEDICINE' : 'CREATE MEDICINE', payload);
    Alert.alert(editId ? 'Medicine updated' : 'Medicine added');
    navigation.goBack();
  };

  return (
    <MedicineForm
      editing={editing}
      editId={editId}
      onSubmit={handleSubmit}
      onCancel={() => navigation.goBack()}
    />
  );
}
