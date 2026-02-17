import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { useOnboarding } from '../state/onboarding';
import { colors, spacing, typography } from '../theme';

function bmiCategory(value?: number): string {
  if (!value) {
    return '—';
  }
  if (value < 18.5) {
    return 'Abaixo do peso';
  }
  if (value < 25) {
    return 'Normal';
  }
  if (value < 30) {
    return 'Sobrepeso';
  }
  return 'Obesidade';
}

export function AnamneseResultScreen() {
  const navigation = useNavigation();
  const { bmi, summary, finishOnboarding } = useOnboarding();
  const [loading, setLoading] = useState(false);

  const category = useMemo(() => bmiCategory(bmi), [bmi]);

  const handleGoHome = async () => {
    setLoading(true);
    try {
      await finishOnboarding();
      const parent = navigation.getParent();
      parent?.reset({
        index: 0,
        routes: [{ name: 'App' as never }],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Seu primeiro resultado</Text>
        <Text style={styles.caption}>Sem julgamento, com foco no seu próximo passo.</Text>

        <Text style={styles.bmiLabel}>IMC</Text>
        <Text style={styles.bmiValue}>{bmi ? bmi.toFixed(2) : '—'}</Text>
        <Text style={styles.bmiCategory}>{category}</Text>
      </Card>

      <Card>
        <Text style={styles.summaryTitle}>Resumo</Text>
        <Text style={styles.summaryText}>
          {summary || 'Recebemos suas respostas e vamos evoluir seu plano nas próximas versões.'}
        </Text>
      </Card>

      <PrimaryButton title="Ir para Home" onPress={() => void handleGoHome()} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.size.title,
    color: colors.text,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
  },
  caption: {
    color: colors.textMuted,
    marginBottom: spacing.md,
    fontSize: typography.size.body,
    lineHeight: 22,
  },
  bmiLabel: {
    color: colors.textMuted,
    fontSize: typography.size.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  bmiValue: {
    fontSize: 42,
    color: colors.primary,
    fontWeight: typography.weight.bold,
    marginTop: spacing.xs,
  },
  bmiCategory: {
    color: colors.text,
    fontSize: typography.size.body,
    marginTop: spacing.xs,
    fontWeight: typography.weight.semibold,
  },
  summaryTitle: {
    fontSize: typography.size.body,
    color: colors.text,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
  },
  summaryText: {
    color: colors.text,
    fontSize: typography.size.body,
    lineHeight: 22,
  },
});
