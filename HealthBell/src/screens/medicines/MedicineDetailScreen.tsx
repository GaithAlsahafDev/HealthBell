// src/screens/medicines/MedicineDetailScreen.tsx
import React, { useMemo } from 'react';
import { View, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { MedicinesStackNavProps } from '../../navigation/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../../components/Button';
import MyText from '../../components/MyText';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { remove } from '../../store/store-slices/MedicinesSlice';
import NetInfo from "@react-native-community/netinfo";
import { medicinesApi } from '../../services/medicinesApi';
import { selectAuthUid } from '../../store/store-slices/AuthSlice';

const MedicineDetailScreen = () => {
  const navigation = useNavigation<MedicinesStackNavProps<'MedicineDetail'>['navigation']>();
  const route = useRoute<MedicinesStackNavProps<'MedicineDetail'>['route']>();
  const data = route.params?.data;

  const dispatch = useAppDispatch();
  const medicines = useAppSelector(s => s.medicines) as Medicine[];
  const uid = useAppSelector(selectAuthUid);

  const med = useMemo(() => medicines.find(m => m.id === data?.id), [data?.id, medicines]);

  if (!data || !med) {
    return (
      <View className="flex-1 bg-white p-4">
        <MyText className="text-[20px] font-bold text-gray-900">No medicine data provided.</MyText>
      </View>
    );
  }

  const dosageLine = [
    med.doseText ?? null,
    med.form ?? null,
  ].filter(Boolean).join(' • ');
  const timesLine = med.times?.length ? med.times.join(' – ') : '—';
  const instructionsText =
    med.instructions === 'before_food' ? 'Before food'
    : med.instructions === 'after_food' ? 'After food'
    : med.instructions === 'with_water' ? 'With water'
    : med.instructions ?? '—';
  const durationText =
    med.courseStart && med.courseEnd ? `${med.courseStart} → ${med.courseEnd}`
    : med.courseStart ? `Since ${med.courseStart}` : '—';

  const onEdit = () => navigation.navigate('AddEditMedicine', { editId: med.id });
  const onDelete = async () => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert("No Internet", "Cannot delete medicines while offline.");
      return;
    }

    if (!uid) {
      Alert.alert("Error", "No user ID found. Please log in again.");
      return;
    }

    try {
      await medicinesApi.remove(uid, med.id);
      dispatch(remove(med.id));
      console.log('Delete', med.id);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to delete medicine. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row items-center gap-2.5 mb-3">
        <View className="w-9 h-9 rounded-full items-center justify-center bg-sky-100">
          <MaterialCommunityIcons name="pill" size={22} color="#0EA5E9" />
        </View>
        <MyText className="text-[20px] font-bold text-gray-900">{med.name}</MyText>
      </View>

      {/* Card with exact-like shadow */}
      <View
        className="
          rounded-[12px] bg-white p-3 gap-2 border border-gray-200
          android:elevation-2
          ios:shadow ios:shadow-black/10 ios:shadow-opacity-[0.06]
          ios:shadow-offset-[0,3] ios:shadow-radius-[6]
        "
      >
        <Row label="Dosage" value={dosageLine || '—'} />
        <Row label="Times" value={timesLine} />
        <Row label="Instructions" value={instructionsText} />
        <Row label="Duration" value={durationText} />
        {med.notes ? <Row label="Notes" value={med.notes} /> : null}
      </View>

      {/* Actions */}
      <View className="flex-row gap-3 mt-4">
        <Button label="Edit" onPress={onEdit} />
        <View className="bg-red-500 rounded-lg overflow-hidden border border-red-500">
          <Button label="Delete" variant="outline" onPress={onDelete} />
        </View>
      </View>
    </View>
  );
};

export default MedicineDetailScreen;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <MyText className="text-[12px] text-gray-500">{label}</MyText>
      <MyText className="text-[15px] text-gray-900 font-medium">{value}</MyText>
    </View>
  );
}
