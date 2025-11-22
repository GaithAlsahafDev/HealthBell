// src/components/Root.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabsNavigator from '../navigation/TabsNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { persistor,store } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { View, ActivityIndicator } from 'react-native';
import AuthStack from '../navigation/AuthStack';
import { loadMedicines } from "../store/thunks/loadMedicines";

const queryClient = new QueryClient();

export default function Root() {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);

      if (firebaseUser) {
        (store.dispatch as any)(loadMedicines());
      }
    });
    return unsubscribe;
  }, []);

  if (!authChecked) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
        <NavigationContainer>
          <QueryClientProvider client={queryClient}>
            {user ? <TabsNavigator /> : <AuthStack />}
          </QueryClientProvider>
        </NavigationContainer>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
