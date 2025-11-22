// src/screens/ProfileScreen.tsx 
import React from 'react';
import { View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import ProfileCard from '../components/ProfileCard';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { clearUser, selectAuthEmail } from '../store/store-slices/AuthSlice';
import { clearAll } from '../store/store-slices/MedicinesSlice';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const email = useAppSelector(selectAuthEmail);

  const performLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      dispatch(clearAll());
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const onLogout = () => {
    performLogout();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={[]}> 
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
    </SafeAreaView>
  );
}
