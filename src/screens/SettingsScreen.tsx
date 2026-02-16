import Constants from 'expo-constants';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { Card } from '../components/Card';
import { Divider } from '../components/Divider';
import { SecondaryButton } from '../components/SecondaryButton';
import { Screen } from '../components/Screen';
import { ENV } from '../config/env';
import { AppDrawerParamList } from '../navigation/types';
import { useAuth } from '../state/AuthContext';
import { useProfile } from '../state/profile';
import { borderRadius, colors, spacing, typography } from '../theme';

type SettingsNavigation = DrawerNavigationProp<AppDrawerParamList, 'AppTabs'>;

export function SettingsScreen() {
  const { user, logout } = useAuth();
  const { name, photoUri } = useProfile();
  const navigation = useNavigation<SettingsNavigation>();

  const displayName = name.trim() || 'Não definido';
  const firstLetter = displayName.charAt(0).toUpperCase();

  const handleOpenProfile = () => {
    navigation.getParent()?.navigate('Profile');
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.profileRow}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{firstLetter}</Text>
            </View>
          )}
          <View style={styles.profileTextWrap}>
            <Text style={styles.text}>Nome: {displayName}</Text>
            <Text style={styles.text}>Logado como: {user?.email ?? 'n/a'}</Text>
          </View>
        </View>
        <Divider />
        <Text style={styles.text}>App: {ENV.APP_NAME}</Text>
        <Text style={styles.text}>Versão: {Constants.expoConfig?.version ?? '1.0.0'}</Text>
      </Card>

      <SecondaryButton title="Editar perfil" onPress={handleOpenProfile} style={styles.actionButton} />
      <SecondaryButton title="Sair" onPress={() => void logout()} variant="danger" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: typography.size.body,
    lineHeight: 22,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  profileTextWrap: {
    flex: 1,
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.pill,
    marginRight: spacing.sm + 2,
  },
  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.pill,
    marginRight: spacing.sm + 2,
    backgroundColor: colors.primary2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: typography.weight.bold,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
});