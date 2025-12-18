import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// =============================================================================
// Medicines Stack
export type MedicinesStackParamList = {
  MedicinesList: undefined;
  AddEditMedicine: { editId?: string } | undefined;
  MedicineDetail: { data: { id: string; name: string } };
};
// =============================================================================
// Tabs
export type TabsParamList = {
  Today: undefined;
  Medicines: undefined;
  HealthTips: undefined;
  Profile: undefined;
};
// =============================================================================
// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: { email?: string } | undefined;
};
// =============================================================================
// Navigation Props
export type MedicinesStackNavProps<T extends keyof MedicinesStackParamList> =
  StackScreenProps<MedicinesStackParamList, T>;

export type TabsNavProps<T extends keyof TabsParamList> =
  BottomTabScreenProps<TabsParamList, T>;

export type AuthStackNavProps<T extends keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, T>;
// =============================================================================
// React Navigation Global Param List
  declare global {
  namespace ReactNavigation {
    interface RootParamList
      extends AuthStackParamList,
        TabsParamList,
        MedicinesStackParamList {}
  }
}
