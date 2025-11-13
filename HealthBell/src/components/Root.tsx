// src/components/Root.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabsNavigator from '../navigation/TabsNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { persistor,store } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import { bootstrap } from "../store/thunks/bootstrap";
import { triggerOutboxSync } from "../store/middleware/syncMiddleware";


const queryClient = new QueryClient();

export default function Root() {
  React.useEffect(() => {
    (store.dispatch as any)(bootstrap());
    store.dispatch(triggerOutboxSync());
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
        <NavigationContainer>
          <QueryClientProvider client={queryClient}>
            <TabsNavigator />
          </QueryClientProvider>
        </NavigationContainer>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
