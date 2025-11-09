// src/screens/medicines/MedicinesListScreen.tsx
import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
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
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <FlatList
          data={medicines}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />

        {/* Extended FAB */}
        <View style={styles.fab}>
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Button label="Add medicine" onPress={openAdd} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 16 },
  listContent: { paddingBottom: 96, rowGap: 12 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    elevation: 4,
  },
});
