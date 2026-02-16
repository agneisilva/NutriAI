import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../theme';

type Variant = 'primary' | 'danger';

type SecondaryButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: Variant;
};

export function SecondaryButton({
  title,
  onPress,
  disabled = false,
  style,
  variant = 'primary',
}: SecondaryButtonProps) {
  const color = variant === 'danger' ? colors.danger : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { borderColor: color },
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
        style,
      ]}
    >
      <Text style={[styles.text, { color }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.semibold,
  },
});