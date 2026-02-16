import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { borderRadius, colors, shadows, themeStyles } from '../theme';

type CardProps = ViewProps;

export function Card({ style, ...props }: CardProps) {
  return <View {...props} style={[styles.card, style]} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...themeStyles.cardPadding,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...shadows.soft,
  },
});