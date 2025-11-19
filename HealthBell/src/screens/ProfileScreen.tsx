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
import { clearOutbox } from '../store/store-slices/OutboxSlice';
import { resetMeta } from '../store/store-slices/MetaSlice';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const email = useAppSelector(selectAuthEmail);
  const outbox = useAppSelector(s => s.outbox);

  const performLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      dispatch(clearAll());
      dispatch(clearOutbox());
      dispatch(resetMeta());
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const onLogout = () => {
    if (outbox.length > 0) {
      Alert.alert(
        "Pending operations",
        "There are unsynced operations waiting to be sent to the server. Logging out now will lose them permanently. Do you want to continue?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Log out anyway", style: "destructive", onPress: performLogout }
        ]
      );
      return;
    }

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
