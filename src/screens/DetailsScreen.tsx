import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { HomeStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme';

type DetailsNavigation = NativeStackNavigationProp<HomeStackParamList, 'Details'>;

export function DetailsScreen() {
  const navigation = useNavigation<DetailsNavigation>();

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Details</Text>
        <Text style={styles.text}>Esta é uma tela de detalhes aberta via stack push a partir da Home.</Text>
      </Card>

      <PrimaryButton title="Voltar" onPress={navigation.goBack} />
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
  },
});