// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAPswGg-dn8osHXZdmorCzsAnkNNUy6orY",
  authDomain: "healthbell-d97ce.firebaseapp.com",
  projectId: "healthbell-d97ce",
  storageBucket: "healthbell-d97ce.firebasestorage.app",
  messagingSenderId: "667659001492",
  appId: "1:667659001492:web:9d1a663ece2d80051e5e81",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);



// -------------------
// Emulator connections
// -------------------
import { connectFirestoreEmulator } from "firebase/firestore";
import { connectAuthEmulator } from "firebase/auth";

if (__DEV__) {
  connectFirestoreEmulator(db, "10.0.2.2", 8085);
  connectAuthEmulator(auth, "http://10.0.2.2:9099");
}
