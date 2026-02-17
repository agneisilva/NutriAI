import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../theme';

type TagVariant = 'success' | 'danger' | 'primary';

type TagProps = {
  text: string;
  variant?: TagVariant;
};

export function Tag({ text, variant = 'primary' }: TagProps) {
  const colorMap = {
    success: { backgroundColor: '#EDF3D0', textColor: '#4B5563' },
    danger: { backgroundColor: '#FDECE9', textColor: colors.danger },
    primary: { backgroundColor: '#FDF1E6', textColor: colors.primary },
  };

  const selected = colorMap[variant];

  return (
    <View style={[styles.tag, { backgroundColor: selected.backgroundColor }]}>
      <Text style={[styles.text, { color: selected.textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  text: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.semibold,
  },
});