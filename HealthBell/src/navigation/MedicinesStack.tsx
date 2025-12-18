import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { MedicinesStackParamList } from './types';
import MedicinesListScreen from '../screens/medicines/MedicinesListScreen';
import AddEditMedicineScreen from '../screens/medicines/AddEditMedicineScreen';
import MedicineDetailScreen from '../screens/medicines/MedicineDetailScreen';

const Stack = createStackNavigator<MedicinesStackParamList>();

const MedicinesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MedicinesList"
        component={MedicinesListScreen}
        options={{ title: 'My Medicines' }}
      />
      <Stack.Screen
        name="AddEditMedicine"
        component={AddEditMedicineScreen}
        options={{ title: 'Medicine' }}
      />
      <Stack.Screen
        name="MedicineDetail"
        component={MedicineDetailScreen}
        options={{ title: 'Medicine Details' }}
      />
    </Stack.Navigator>
  );
}
export default MedicinesStack;
