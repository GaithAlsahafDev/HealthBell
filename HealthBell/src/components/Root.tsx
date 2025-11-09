// src/components/Root.tsx
import { NavigationContainer } from '@react-navigation/native';
import TabsNavigator from '../navigation/TabsNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Root() {
  return (
     <SafeAreaProvider>
      <NavigationContainer>
       <TabsNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
