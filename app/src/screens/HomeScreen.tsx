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
import { useOnboarding } from '../state/onboarding';
import { useProfile } from '../state/profile';
import { colors, spacing, typography } from '../theme';

type HomeNavigation = NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>;

export function HomeScreen() {
  const { user } = useAuth();
  const { name } = useProfile();
  const { hasCompletedAnamnese, bmi } = useOnboarding();
  const navigation = useNavigation<HomeNavigation>();

  const displayName = name.trim() || user?.email?.split('@')[0] || 'você';

  const bmiCategory = (() => {
    if (!bmi) {
      return '—';
    }
    if (bmi < 18.5) {
      return 'Abaixo do peso';
    }
    if (bmi < 25) {
      return 'Normal';
    }
    if (bmi < 30) {
      return 'Sobrepeso';
    }
    return 'Obesidade';
  })();

  const handleOpenDetails = () => {
    navigation.navigate('Details');
  };

  return (
    <Screen>
      <Card>
        {hasCompletedAnamnese ? (
          <>
            <Text style={styles.greeting}>Olá, {displayName} 👋</Text>
            <Text style={styles.progress}>Seu IMC: {bmi ? `${bmi.toFixed(2)} (${bmiCategory})` : '—'}</Text>
            <Text style={styles.nextStep}>Próximo passo: em breve vamos montar seu plano alimentar.</Text>
            <Divider />
          </>
        ) : (
          <>
            <Text style={styles.greeting}>Olá, {displayName} 👋</Text>
            <Text style={styles.nextStep}>Complete sua anamnese para liberar seu primeiro direcionamento.</Text>
            <PrimaryButton
              title="Completar anamnese"
              onPress={() => {
                const parent = navigation.getParent()?.getParent()?.getParent();
                parent?.navigate('Onboarding' as never);
              }}
            />
            <Divider />
          </>
        )}

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
  greeting: {
    color: colors.text,
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
  },
  progress: {
    color: colors.text,
    fontSize: typography.size.body,
    marginBottom: spacing.xs,
    fontWeight: typography.weight.semibold,
  },
  nextStep: {
    color: colors.textMuted,
    fontSize: typography.size.body,
    lineHeight: 21,
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