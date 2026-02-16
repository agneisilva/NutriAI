import React from 'react';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../state/AuthContext';
import { useProfile } from '../state/profile';
import { borderRadius, colors, spacing, typography } from '../theme';

export function AppDrawerContent(props: DrawerContentComponentProps) {
  const { user } = useAuth();
  const { name, photoUri } = useProfile();

  const drawerName = name.trim() || user?.email || 'Usuário';
  const initial = drawerName.charAt(0).toUpperCase();

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.profileHeader}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        )}
        <View style={styles.textWrap}>
          <Text style={styles.name} numberOfLines={1}>
            {drawerName}
          </Text>
          <Text style={styles.subtitle}>Menu lateral</Text>
        </View>
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.pill,
    marginRight: spacing.sm + 2,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.pill,
    marginRight: spacing.sm + 2,
    backgroundColor: colors.primary2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: typography.weight.bold,
    color: colors.white,
  },
  textWrap: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: typography.weight.bold,
  },
  subtitle: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 13,
  },
});