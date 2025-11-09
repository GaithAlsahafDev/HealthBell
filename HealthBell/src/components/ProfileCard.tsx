import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MyText from './MyText'; // ← استدعِ المكون

interface Props {
  name: string;
  email: string;
}

export default function ProfileCard({ name, email }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <MaterialCommunityIcons name="account-circle" size={64} color="#6b7280" />
      </View>
      <View style={styles.info}>
        <MyText style={styles.name}>{name}</MyText>
        <MyText style={styles.email}>{email}</MyText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '80%',
    maxWidth: 340,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fafafa',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    padding: 20,
  },
  avatar: { marginBottom: 10 },
  info: { alignItems: 'center' },
  name: { fontSize: 18, fontWeight: '700', color: '#111827' },
  email: { fontSize: 14, color: '#6b7280', marginTop: 2 },
});
