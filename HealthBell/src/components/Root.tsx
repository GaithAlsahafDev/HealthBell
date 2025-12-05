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
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import AuthStack from '../navigation/AuthStack';
import { loadMedicines } from "../store/thunks/loadMedicines";
import * as SplashScreen from "expo-splash-screen";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function Root() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    setIsAuthLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthLoading(false);

      if (firebaseUser) {
        store.dispatch(loadMedicines(firebaseUser.uid));
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
      SplashScreen.hideAsync();
    }
  }, [isAuthLoading]);

  if (isAuthLoading) {
    return null;
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
