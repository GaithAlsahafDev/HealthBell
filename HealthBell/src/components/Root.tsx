// src/components/Root.tsx
import { NavigationContainer } from '@react-navigation/native';
import TabsNavigator from '../navigation/TabsNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Root() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <QueryClientProvider client={queryClient}>
          <TabsNavigator />
        </QueryClientProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
