// src/screens/RegisterScreen.tsx
import React, { useRef } from 'react';
import { View, TextInput, Pressable, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import MyText from '../components/MyText';
import MyTextInput from '../components/MyTextInput';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import type { AuthStackNavProps } from '../navigation/types';
import { useAppDispatch } from '../hooks/reduxHooks';
import { setUser } from '../store/store-slices/AuthSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const schema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Min 6 chars').required('Required'),
});

export default function RegisterScreen({ navigation }: AuthStackNavProps<'Register'>) {
  const dispatch = useAppDispatch();
  const passwordInputRef = useRef<TextInput | null>(null);
  const { top } = useSafeAreaInsets();

  const handleRegister = async (email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      dispatch(setUser({ uid: cred.user.uid, email: cred.user.email }));
    } catch (error: any) {
      Alert.alert('Register Error', error.message);
    }
  };

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
  } = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: values => handleRegister(values.email, values.password),
  });

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: top }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          className="flex-1 px-6"
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-grow justify-center"
        >
          <View className="items-center mb-8">
            <Image
              source={require('../../assets/health-bell-logo.png')}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
            <MyText className="text-3xl font-bold mt-4">Create Account</MyText>
            <MyText className="text-gray-500">Sign up to get started</MyText>
          </View>

          <View className="gap-4">
            <MyTextInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              autoCapitalize="none"
              autoComplete='email'
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
            />

            {touched.email && errors.email ? (
              <MyText className="text-red-500 text-xs">{errors.email}</MyText>
            ) : null}

            <MyTextInput
              ref={passwordInputRef}
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              autoComplete='new-password'
              onBlur={handleBlur('password')}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={() => handleSubmit()}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
