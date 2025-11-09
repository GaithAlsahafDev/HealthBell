import React from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MedicinesStackNavProps } from '../../navigation/types';
import MedicineCard from '../../components/MedicineCard';
import Button from '../../components/Button';

const { medicines } = require('../../data/medicines.json') as {
  medicines: { id: string; name: string; dosageMg?: number; frequency?: string }[];
};

export default function MedicinesListScreen() {
  const navigation = useNavigation<MedicinesStackNavProps<'MedicinesList'>['navigation']>();

  const openDetail = (item: (typeof medicines)[number]) =>
    navigation.navigate('MedicineDetail', { data: { id: item.id, name: item.name } });

  const openAdd = () => navigation.navigate('AddEditMedicine');

  const renderItem = ({ item }: { item: (typeof medicines)[number] }) => (
    <MedicineCard
      name={item.name}
      dosageMg={item.dosageMg}
      frequency={item.frequency}
      hint="Tap to view details"
      onPress={() => openDetail(item)}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={[]}>
      <View className="flex-1">
        <FlatList
          data={medicines}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingBottom: 96,
            rowGap: 12,
            paddingTop: 0,
          }}
        />

        <View className="absolute right-4 bottom-6 bg-sky-500 px-4 h-12 rounded-full justify-center items-center flex-row gap-1.5">
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Button label="Add medicine" onPress={openAdd} />
        </View>
      </View>
    </SafeAreaView>
  );
}
