import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useAuth } from '../state/AuthContext';

export function HeaderLogoutButton() {
  const { logout } = useAuth();

  return (
    <Pressable onPress={() => void logout()} style={styles.button}>
      <Text style={styles.text}>Sair</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    color: '#1d4ed8',
    fontWeight: '600',
    fontSize: 14,
  },
});