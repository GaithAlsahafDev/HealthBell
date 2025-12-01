// src/components/DoseItem.tsx
import React from 'react';
import { View } from 'react-native';
import Button from '../Button';
import MyText from '../MyText';

type Props = {
  item: {
    id: string;
    medicineName: string;
    time: string;
    status: 'upcoming' | 'taken' | 'missed';
  };
  onSetStatus: (id: string, status: 'taken' | 'missed') => void;
};

export default function DoseItem({ item, onSetStatus }: Props) {
  const isTaken = item.status === 'taken';
  const isMissed = item.status === 'missed';

  return (
    <View className="rounded-2xl border border-gray-200 bg-white px-4 py-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 shrink pr-3">
          <View
            className={`h-2.5 w-2.5 rounded-full ${
              isTaken ? 'bg-green-500' : isMissed ? 'bg-red-500' : 'bg-amber-400'
            }`}
          />
          <View className="shrink">
            <MyText className="text-[17px] font-semibold text-gray-900">{item.medicineName}</MyText>
            <View className="flex-row items-center mt-0.5">
              <MyText className="text-[12px] text-gray-500">{item.time}</MyText>
              <View
                className={`ml-2 px-2 py-0.5 rounded-full ${
                  isTaken ? 'bg-green-100' : isMissed ? 'bg-red-100' : 'bg-amber-100'
                }`}
              >
                <MyText
                  className={`text-[11px] font-medium ${
                    isTaken ? 'text-green-700' : isMissed ? 'text-red-700' : 'text-amber-700'
                  }`}
                >
                  {item.status === 'taken'
                    ? 'Taken'
                    : item.status === 'missed'
                    ? 'Missed'
                    : 'Upcoming'}
                </MyText>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row gap-2">
          <Button
            label="Taken"
            variant="primary"
            onPress={() => onSetStatus(item.id, 'taken')}
          />
          <Button
            label="Missed"
            variant="outline"
            onPress={() => onSetStatus(item.id, 'missed')}
          />
        </View>
      </View>
    </View>
  );
}
