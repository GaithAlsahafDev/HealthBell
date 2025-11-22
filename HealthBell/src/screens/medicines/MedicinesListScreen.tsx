// src/screens/medicines/MedicinesListScreen.tsx
import React, { useEffect } from 'react';
import { View, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MedicinesStackNavProps } from '../../navigation/types';
import MedicineCard from '../../components/MedicineCard';
import Button from '../../components/Button';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import MyText from '../../components/MyText';
import { medicinesApi } from '../../services/medicinesApi';
import { add, clearAll } from '../../store/store-slices/MedicinesSlice';
import { selectAuthUid } from '../../store/store-slices/AuthSlice';

export default function MedicinesListScreen() {
  const navigation = useNavigation<MedicinesStackNavProps<'MedicinesList'>['navigation']>();
  const dispatch = useAppDispatch();

  const cached = useAppSelector(s => s.medicines) as Medicine[];
  const uid = useAppSelector(selectAuthUid);

  useEffect(() => {
    const load = async () => {
      if (!uid) return;

      try {
        const data = await medicinesApi.getAll(uid);
        dispatch(clearAll());
        data.forEach(item => dispatch(add(item)));
      } catch (error) {
        Alert.alert('Error', 'Failed to load medicines. Please check your connection.');
      }
    };

    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation, dispatch, uid]);

  const list: Medicine[] = cached;

  const openDetail = (item: Medicine) =>
    navigation.navigate('MedicineDetail', { data: { id: item.id, name: item.name } });

  const openAdd = () => navigation.navigate('AddEditMedicine');

  const renderItem = ({ item }: { item: Medicine }) => (
    <MedicineCard
      name={item.name}
      doseText={item.doseText}
      hint="Tap to view details"
      onPress={() => openDetail(item)}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={[]}>
      <View className="flex-1">
        <FlatList
          data={list}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerClassName="pb-32 gap-3 pt-0"
          ListEmptyComponent={
            <View className="p-4">
              <MyText>No data</MyText>
            </View>
          }
        />

        {/* الشارة: فوق الزر وعلى الجهة اليسرى */}

        {/* الزر ثابت أسفل اليمين */}
        <View className="absolute right-4 bottom-6 bg-sky-500 px-4 h-12 rounded-full justify-center items-center flex-row gap-1.5">
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Button label="Add medicine" onPress={openAdd} />
        </View>
      </View>
    </SafeAreaView>
  );
}
