// src/screens/medicines/MedicinesListScreen.tsx
import React from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MedicinesStackNavProps } from '../../navigation/types';
import MedicineCard from '../../components/MedicineCard';
import Button from '../../components/Button';
import { useAppSelector } from '../../hooks/reduxHooks';
import MyText from '../../components/MyText';


export default function MedicinesListScreen() {
  const navigation = useNavigation<MedicinesStackNavProps<'MedicinesList'>['navigation']>();

  const cached = useAppSelector(s => s.medicines) as Medicine[];

  const list: Medicine[] = cached;

  const openDetail = (item: Medicine) =>
    navigation.navigate('MedicineDetail', { data: { id: item.id, name: item.name } });

  const openAdd = () => navigation.navigate('AddEditMedicine');

  const renderItem = ({ item }: { item: Medicine }) => (
    <MedicineCard
      name={item.name}
      dosageMg={item.dosageMg}
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
