// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import ProfileCard from '../components/ProfileCard';
import MyText from '../components/MyText'; // ← استدعاء مكون النص الموحد

const profile: { name: string; email: string } = require('../data/profile.json');

export default function ProfileScreen() {
  const onLogout = () => {
    console.log('Logout');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <MyText style={styles.header}>Profile</MyText>

        <View style={styles.center}>
          <ProfileCard name={profile.name} email={profile.email} />

          <View style={styles.logoutWrap}>
            <View style={styles.buttonBlock}>
              <Button
                label="Log out"
                variant="primary"
                onPress={onLogout}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 16 },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12, marginTop: 4 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20,
    marginTop: 60,
  },
  logoutWrap: { width: '80%', maxWidth: 340, marginTop: 12 },
  buttonBlock: { width: '100%' },
});
