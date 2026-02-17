import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { Tag } from '../components/Tag';
import { colors, spacing, typography } from '../theme';

const items = Array.from({ length: 20 }, (_, index) => `Item fictício #${index + 1}`);

export function ExploreScreen() {
  return (
    <Screen scroll={false}>
      <FlatList
        data={items}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <Card style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemText}>{item}</Text>
              <Tag text={index % 2 === 0 ? 'Ativo' : 'Novo'} variant={index % 2 === 0 ? 'success' : 'primary'} />
            </View>
            <Text style={styles.itemSubtext}>Conteúdo exemplo para explorar a listagem em cards.</Text>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: spacing.lg,
  },
  itemCard: {
    paddingVertical: spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemText: {
    fontSize: typography.size.body,
    color: colors.text,
    fontWeight: typography.weight.semibold,
  },
  itemSubtext: {
    color: colors.textMuted,
    fontSize: typography.size.body,
  },
});