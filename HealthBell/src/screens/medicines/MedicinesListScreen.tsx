import React from 'react';
import { View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MedicinesStackNavProps } from '../../navigation/types';
import MedicineCard from '../../components/MedicineCard';
import Button from '../../components/Button';
import Axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '../../hooks/reduxHooks';
import MyText from '../../components/MyText';

//const API_URL = '../../data/medicines.json';
const API_URL = '';

export default function MedicinesListScreen() {
  const navigation = useNavigation<MedicinesStackNavProps<'MedicinesList'>['navigation']>();

  const cached = useAppSelector(s => s.medicines) as Medicine[];

  const {
    data: fetched,isError,isSuccess,isLoading,dataUpdatedAt,} = useQuery<Medicine[]>({
    queryKey: ['fetchMedicines'],
    queryFn: async () => {
      const res = await Axios.get<Medicine[] | { medicines: Medicine[] }>(API_URL, { timeout: 10000 });
      return Array.isArray(res.data) ? res.data : res.data.medicines;
    },
    retry: 1,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    placeholderData: () => cached,
  });

  const lastOkAtRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (isSuccess && fetched) lastOkAtRef.current = Date.now();
  }, [isSuccess, fetched]);

  const list: Medicine[] = isError ? cached : (fetched ?? cached);

  const lastUpdatedMs =
    lastOkAtRef.current ?? (dataUpdatedAt && !isNaN(dataUpdatedAt) ? dataUpdatedAt : null);
  const lastUpdated =
    lastUpdatedMs !== null
      ? new Date(lastUpdatedMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : null;

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
              <MyText>{isLoading ? 'Loading…' : 'No data'}</MyText>
            </View>
          }
        />

        {/* الشارة: فوق الزر وعلى الجهة اليسرى */}
        {isError && cached.length > 0 && (
          <View className="absolute left-4 bottom-24 bg-amber-100 border border-amber-300 rounded-full px-3 h-10 flex-row items-center gap-2">
            <MaterialCommunityIcons name="wifi-off" size={18} color="#92400e" />
            <MyText className="text-amber-900">
              {lastUpdated ? `Last update: ${lastUpdated}` : ''}
            </MyText>
          </View>
        )}

        {/* الزر ثابت أسفل اليمين */}
        <View className="absolute right-4 bottom-6 bg-sky-500 px-4 h-12 rounded-full justify-center items-center flex-row gap-1.5">
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Button label="Add medicine" onPress={openAdd} />
        </View>
      </View>
    </SafeAreaView>
  );
}
