// src/screens/ProfileScreen.tsx
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import ProfileCard from '../components/ProfileCard';
import MyText from '../components/MyText'; // ← استدعاء مكون النص الموحد
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const profile: { name: string; email: string } = require('../data/profile.json');

export default function ProfileScreen() {
  const onLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={[]}> 
      <View className="flex-1 px-4">
        <View className="flex-1 items-center justify-start gap-5 mt-[60px]">
          <ProfileCard name={profile.name} email={profile.email} />

          <View className="w-4/5 max-w-[340px] mt-3">
            <View className="w-full">
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