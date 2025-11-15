// src/screens/RegisterScreen.tsx
import React from 'react';
import { View, TextInput, Pressable, Image, Alert } from 'react-native';
import MyText from '../components/MyText';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import type { AuthStackNavProps } from '../navigation/types';
import { useAppDispatch } from '../hooks/reduxHooks';
import { setUser } from '../store/store-slices/AuthSlice';
import { Formik } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 chars').required('Required'),
});

export default function RegisterScreen({ navigation }: AuthStackNavProps<'Register'>) {
  const dispatch = useAppDispatch();

  const handleRegister = async (email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      dispatch(setUser({ uid: cred.user.uid, email: cred.user.email }));
    } catch (error: any) {
      Alert.alert('Register Error', error.message);
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
        <MyText className="text-3xl font-bold mt-4">Create Account</MyText>
        <MyText className="text-gray-500">Sign up to get started</MyText>
      </View>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={schema}
        onSubmit={values => handleRegister(values.email, values.password)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View className="gap-4">
            <TextInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              autoCapitalize="none"
              keyboardType="email-address"
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />

            {touched.email && errors.email ? (
              <MyText className="text-red-500 text-xs">{errors.email}</MyText>
            ) : null}

            <TextInput
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />

            {touched.password && errors.password ? (
              <MyText className="text-red-500 text-xs">{errors.password}</MyText>
            ) : null}

            <Pressable
              className="bg-sky-500 py-3 rounded-xl mt-2 items-center"
              onPress={() => handleSubmit()}
            >
              <MyText className="text-white font-semibold text-base">Register</MyText>
            </Pressable>
          </View>
        )}
      </Formik>

      <View className="items-center mt-6">
        <MyText className="text-gray-600">Already have an account?</MyText>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <MyText className="text-sky-500 font-medium mt-1">Go to Login</MyText>
        </Pressable>
      </View>
    </View>
  );
}
