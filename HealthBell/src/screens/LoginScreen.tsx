// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, Pressable, Image, Alert } from 'react-native';
import MyText from '../components/MyText';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import type { AuthStackNavProps } from '../navigation/types';
import { useAppDispatch } from '../hooks/reduxHooks';
import { setUser } from '../store/store-slices/AuthSlice';

export default function LoginScreen({ navigation }: AuthStackNavProps<'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUser({ uid: cred.user.uid, email: cred.user.email }));
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="items-center mb-8">
        <Image
          source={require('../../assets/health-bell-logo.png')}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
        <MyText className="text-3xl font-bold mt-4">Welcome Back</MyText>
        <MyText className="text-gray-500">Login to continue</MyText>
      </View>

      <View className="gap-4">
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        />

        <Pressable
          className="bg-sky-500 py-3 rounded-xl mt-2 items-center"
          onPress={handleLogin}
        >
          <MyText className="text-white font-semibold text-base">Login</MyText>
        </Pressable>
      </View>

      <View className="items-center mt-6">
        <MyText className="text-gray-600">Don't have an account?</MyText>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <MyText className="text-sky-500 font-medium mt-1">Create one</MyText>
        </Pressable>
      </View>
    </View>
  );
}
