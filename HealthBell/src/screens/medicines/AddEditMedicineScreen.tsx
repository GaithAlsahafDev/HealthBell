// src/screens/medicines/AddEditMedicineScreen.tsx
import React, { useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { MedicinesStackNavProps } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { add, update } from '../../store/store-slices/MedicinesSlice';
import MedicineForm from '../../components/medicines/MedicineForm';
import NetInfo from "@react-native-community/netinfo";
import { medicinesApi } from '../../services/medicinesApi';
import { selectAuthUid } from '../../store/store-slices/AuthSlice';

export default function AddEditMedicineScreen() {
  const navigation = useNavigation<MedicinesStackNavProps<'AddEditMedicine'>['navigation']>();
  const route = useRoute<MedicinesStackNavProps<'AddEditMedicine'>['route']>();
  const editId = route.params?.editId;

  const dispatch = useAppDispatch();
  const medicines = useAppSelector(s => s.medicines) as Medicine[];
  const uid = useAppSelector(selectAuthUid);

  const editing = useMemo(() => medicines.find(m => m.id === editId), [editId, medicines]);

  const handleSubmit = async (payload: Medicine) => {

    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert("No Internet", "Cannot modify medicines while offline.");
      return;
    }

    if (!uid) {
      Alert.alert("Error", "No user ID found. Please log in again.");
      return;
    }

    try {
      if (editId) {
        await medicinesApi.update(uid, payload);
        dispatch(update(payload));
      } else {
        await medicinesApi.create(uid, payload);
        dispatch(add(payload));
      }

      console.log(editId ? 'UPDATE MEDICINE' : 'CREATE MEDICINE', payload);
      Alert.alert(editId ? 'Medicine updated' : 'Medicine added');
      navigation.goBack();

    } catch (error) {
      Alert.alert("Error", "Failed to save medicine. Please try again.");
    }
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
