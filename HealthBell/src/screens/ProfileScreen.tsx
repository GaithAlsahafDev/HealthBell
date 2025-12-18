// src/screens/ProfileScreen.tsx
import React from 'react';
import { View } from 'react-native';
import Button from '../components/Button';
import ProfileCard from '../components/ProfileCard';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAppDispatch } from '../hooks/reduxHooks';
import { clearAll } from '../store/store-slices/MedicinesSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const email = auth.currentUser?.email;

  const { top } = useSafeAreaInsets();
  const containerStyle = { paddingTop: top };

  const performLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearAll());
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const onLogout = () => {
    performLogout();
  };

  return (
    <View className="flex-1 bg-white" style={containerStyle}>
      <View className="flex-1 px-4">
        <View className="flex-1 items-center justify-start gap-5 mt-[60px]">
          <ProfileCard name={email ?? ''} email={email ?? ''} />

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
    </View>
  );
}
