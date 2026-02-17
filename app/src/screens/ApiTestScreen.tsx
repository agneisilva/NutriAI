import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { Tag } from '../components/Tag';
import { ENV } from '../config/env';
import { HealthResult, testApiHealth } from '../services/api';
import { colors, spacing, typography } from '../theme';

export function ApiTestScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HealthResult | null>(null);

  const handleTestApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await testApiHealth(ENV.API_URL);
      setResult(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao testar API.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Teste de API</Text>
        <Text style={styles.label}>Base URL atual:</Text>
        <Text style={styles.mono}>{ENV.API_URL}</Text>
      </Card>

      <PrimaryButton title="Testar API" onPress={() => void handleTestApi()} loading={loading} />

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Testando conexão com a API...</Text>
        </View>
      ) : null}

      {result ? (
        <Card>
          <Text style={styles.label}>Endpoint:</Text>
          <Text style={styles.mono}>{result.endpoint}</Text>
          <Text style={styles.label}>Status code:</Text>
          <Tag
            text={String(result.status)}
            variant={result.status >= 200 && result.status < 300 ? 'success' : 'danger'}
          />
          <Text style={styles.label}>Body:</Text>
          <Text style={styles.body}>{result.body || '(vazio)'}</Text>
        </Card>
      ) : null}

      {error ? (
        <Card>
          <Text style={styles.errorTitle}>Erro amigável</Text>
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: typography.size.title,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  label: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: typography.weight.semibold,
  },
  mono: {
    fontSize: 13,
    color: colors.text,
  },
  body: {
    color: colors.text,
    lineHeight: 20,
  },
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  loadingText: {
    marginLeft: spacing.sm,
    color: colors.textMuted,
    fontSize: typography.size.body,
  },
  errorTitle: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
});