import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyText from '../components/MyText';

export default function HealthTipsScreen() {
  const webRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const goBack = useCallback(() => {
    if (canGoBack) webRef.current?.goBack();
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>

        {canGoBack && (
        <TouchableOpacity
          onPress={goBack}
          style={styles.backBtn}
          disabled={!canGoBack}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={canGoBack ? '#007AFF' : '#9CA3AF'}
          />
          <MyText style={[styles.backText, !canGoBack && styles.backTextDisabled]}>
            Back
          </MyText>
        </TouchableOpacity>
        )}

        <MyText style={styles.title}>Health Tips</MyText>
      </View>

      <WebView
        ref={webRef}
        source={{ uri: 'https://www.healthline.com/health' }}
        startInLoadingState
        onNavigationStateChange={(nav) => setCanGoBack(nav.canGoBack)}
        style={styles.webview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6 },
  backText: { color: '#007AFF', fontSize: 15, fontWeight: '500' },
  backTextDisabled: { color: '#9CA3AF' },
  title: { fontSize: 16, fontWeight: '600', marginLeft: 8, color: '#111827' },
  webview: { flex: 1 },
});
