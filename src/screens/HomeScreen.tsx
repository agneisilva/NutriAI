import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../components/Card';
import { Divider } from '../components/Divider';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { HomeStackParamList } from '../navigation/types';
import { useAuth } from '../state/AuthContext';
import { colors, spacing, typography } from '../theme';

type HomeNavigation = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;

export function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<HomeNavigation>();

  const handleOpenDetails = () => {
    navigation.navigate('Details');
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.body}>Bem-vindo ao template com identidade visual moderna.</Text>
        <Divider />
        <Text style={styles.meta}>Logado como: {user?.email ?? 'usuário'}</Text>
      </Card>

      <PrimaryButton title="Abrir detalhes" onPress={handleOpenDetails} />
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
  body: {
    fontSize: typography.size.body,
    lineHeight: 22,
    color: colors.text,
  },
  meta: {
    fontSize: typography.size.body,
    color: colors.textMuted,
  },
});