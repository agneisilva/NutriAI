import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { OnboardingStackParamList } from '../navigation/types';
import { borderRadius, colors, spacing, typography } from '../theme';

type WelcomeNavigation = NativeStackNavigationProp<OnboardingStackParamList, 'Welcome'>;

export function WelcomeScreen() {
  const navigation = useNavigation<WelcomeNavigation>();

  return (
    <Screen style={styles.container}>
      <Card>
        <View style={styles.accentLine} />
        <Text style={styles.title}>Seu nutricionista digital, em minutos</Text>
        <Text style={styles.body}>
          Vamos fazer uma anamnese curta para entender seu momento atual e te entregar um primeiro
          direcionamento com carinho e objetividade.
        </Text>
      </Card>

      <PrimaryButton title="Começar" onPress={() => navigation.navigate('AnamneseChat')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  accentLine: {
    width: 52,
    height: 6,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary2,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 30,
  },
  body: {
    fontSize: typography.size.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
});
