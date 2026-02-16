import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { useAuth } from '../state/AuthContext';
import { borderRadius, colors, spacing, typography } from '../theme';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível fazer login.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <Card style={styles.loginCard}>
        <View style={styles.accentLine} />
        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.subtitle}>Entre para continuar no template mobile.</Text>

        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="voce@exemplo.com"
          autoCorrect={false}
        />

        <TextField
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="********"
          autoCorrect={false}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton title="Entrar" onPress={() => void handleLogin()} loading={loading} style={styles.loginButton} />

        <Pressable onPress={() => setError('Fluxo de recuperação ainda não implementado (placeholder).')}>
          <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  loginCard: {
    marginTop: spacing.xl,
  },
  accentLine: {
    width: 52,
    height: 6,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.primary2,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.size.h1,
    fontWeight: typography.weight.bold,
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    fontSize: typography.size.body,
    color: colors.textMuted,
    lineHeight: 22,
  },
  error: {
    marginBottom: spacing.sm,
    color: colors.danger,
    fontSize: 14,
    fontWeight: typography.weight.semibold,
  },
  loginButton: {
    marginTop: spacing.xs,
  },
  forgotPassword: {
    marginTop: spacing.md,
    textAlign: 'center',
    color: colors.primary,
    fontWeight: typography.weight.semibold,
  },
});