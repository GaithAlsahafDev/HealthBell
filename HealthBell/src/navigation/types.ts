import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Tabs: undefined;
};

export type MedicinesStackParamList = {
  MedicinesList: undefined;
  AddEditMedicine: { editId?: string } | undefined;
  /** Detail expects a data object like your example (data.name, ...). */
  MedicineDetail: { data: { id: string; name: string } };
};

export type TabsParamList = {
  Today: undefined;
  Medicines: undefined;
  HealthTips: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

/** Screen prop helpers */
export type MedicinesStackNavProps<T extends keyof MedicinesStackParamList> =
  StackScreenProps<MedicinesStackParamList, T>;

export type TabsNavProps<T extends keyof TabsParamList> =
  BottomTabScreenProps<TabsParamList, T>;

export type RootStackNavProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type AuthStackNavProps<T extends keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, T>;