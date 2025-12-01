// src/screens/HealthTipsScreen.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, TouchableOpacity, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MyText from '../components/MyText';

export default function HealthTipsScreen() {
  const webRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const containerStyle = { paddingBottom: bottom };

  const goBack = useCallback(() => {
    if (canGoBack) webRef.current?.goBack();
  }, [canGoBack]);

  useEffect(() => {
    const onHardwareBackPress = () => {
      if (canGoBack) {
        webRef.current?.goBack();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onHardwareBackPress);
    return () => subscription.remove();
  }, [canGoBack]);

  return (
    <View className="flex-1 bg-white" style={containerStyle}>
      <View className="flex-row items-center px-3 py-2 bg-gray-50 border-b border-gray-200">

        {canGoBack && (
        <TouchableOpacity
          onPress={goBack}
          className="flex-row items-center gap-1 p-[6px]"
          disabled={!canGoBack}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={canGoBack ? '#007AFF' : '#9CA3AF'}
          />
          <MyText className={`text-[15px] font-medium ${!canGoBack ? 'text-gray-400' : 'text-[#007AFF]'}`}>
            Back
          </MyText>
        </TouchableOpacity>
        )}
      </View>

      <WebView
        ref={webRef}
        source={{ uri: 'https://www.healthline.com/health' }}
        startInLoadingState
        onNavigationStateChange={(nav) => setCanGoBack(Boolean(nav.canGoBack))}
        className="flex-1"
      />
    </View>
  );
}
