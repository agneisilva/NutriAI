import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../state/AuthContext';
import { useNetwork } from '../state/network';
import { useProfile } from '../state/profile';
import { borderRadius, colors, spacing, typography } from '../theme';
import { OfflineIndicator } from './OfflineIndicator';

function ProfileMiniAvatar() {
  const { name, photoUri } = useProfile();
  const firstLetter = name.trim().charAt(0).toUpperCase() || 'U';

  if (photoUri) {
    return <Image source={{ uri: photoUri }} style={styles.avatarImage} />;
  }

  return (
    <View style={styles.avatarFallback}>
      <Text style={styles.avatarText}>{firstLetter}</Text>
    </View>
  );
}

export function HeaderActions() {
  const { logout } = useAuth();
  const { isOffline } = useNetwork();

  return (
    <View style={styles.wrapper}>
      {isOffline ? <OfflineIndicator /> : <ProfileMiniAvatar />}

      <Pressable onPress={() => void logout()} style={styles.logoutButton} hitSlop={8}>
        <Ionicons name="log-out-outline" size={20} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 26,
    height: 26,
    borderRadius: borderRadius.pill,
    marginRight: spacing.sm,
  },
  avatarFallback: {
    width: 26,
    height: 26,
    borderRadius: borderRadius.pill,
    marginRight: spacing.sm,
    backgroundColor: colors.primary2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: typography.weight.bold,
  },
  logoutButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
});