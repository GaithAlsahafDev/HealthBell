// src/components/medicines/MedicineFormUI.tsx
import React from 'react';
import {
  View, TouchableOpacity
} from 'react-native';
import MyText from '../MyText';

export const UNITS = ['mg', 'ml', 'g', 'mcg', 'drops', 'tablet', 'capsule'] as const;
export type Unit = (typeof UNITS)[number];

/* ---------- عناصر مساعدة ---------- */
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="mb-[14px]">
      <MyText className="text-[12px] text-gray-500 mb-1.5">{label}</MyText>
      {children}
    </View>
  );
}

export function UnitPicker({ value, onChange }: { value: Unit; onChange: (u: Unit) => void }) {
  return (
    <View className="flex-row flex-wrap gap-1.5">
      {UNITS.map(u => (
        <TouchableOpacity
          key={u}
          onPress={() => onChange(u)}
          className={`h-9 px-2.5 rounded-lg border items-center justify-center mb-1.5 ${value === u ? 'bg-sky-500 border-sky-500' : 'bg-white border-gray-300'}`}
          accessibilityRole="button"
        >
          <MyText className={`font-semibold ${value === u ? 'text-white' : 'text-gray-700'}`}>{u}</MyText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function Chip({
  label, active, onPress, disabled
}: { label: string; active: boolean; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`h-[34px] px-3 rounded-full border items-center justify-center ${active ? 'bg-sky-500 border-sky-500' : 'bg-white border-gray-300'} ${disabled ? 'opacity-50' : ''}`}
      accessibilityRole="button"
    >
      <MyText className={`text-[12px] font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{label}</MyText>
    </TouchableOpacity>
  );
}

export function InstructionsPicker({
  value, onChange
}: { value: string; onChange: (v: string) => void }) {
  const options = [
    { key: 'before_food', label: 'Before food' },
    { key: 'after_food', label: 'After food' },
    { key: 'with_water', label: 'With water' },
  ];
  return (
    <View className="flex-row flex-wrap gap-2 mt-2">
      {options.map(opt => {
        const active = value === opt.key;
        return (
          <TouchableOpacity
            key={opt.key}
            onPress={() => onChange(opt.key)}
            className={`h-[34px] px-3 rounded-full border items-center justify-center ${active ? 'bg-sky-500 border-sky-500' : 'bg-white border-gray-300'}`}
            accessibilityRole="button"
          >
            <MyText className={`text-[12px] font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{opt.label}</MyText>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity onPress={() => onChange('')} className="h-[34px] px-3 rounded-full border bg-white border-gray-300 items-center justify-center" accessibilityRole="button">
        <MyText className="text-[12px] font-semibold text-gray-700">None</MyText>
      </TouchableOpacity>
    </View>
  );
}
